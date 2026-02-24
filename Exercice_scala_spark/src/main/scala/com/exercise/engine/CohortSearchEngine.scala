package com.exercise.engine

import com.exercise.model._
import com.exercise.utils.{SolrConf, SolrConnector}
import com.typesafe.scalalogging.LazyLogging
import org.apache.spark.sql.{DataFrame, SparkSession}
import org.apache.spark.sql.functions._

class CohortSearchEngine(spark: SparkSession, solrConf: SolrConf) extends LazyLogging {
  private val connector = new SolrConnector(spark, solrConf)


  private def mapResourceToCollection(resource: String): String = resource match {
    case "Patient" => "patientAphp"
    case "Encounter" => "encounterAphp"
    case "DocumentReference" => "documentReferenceAphp"
    case other => throw new IllegalArgumentException(s"Unknown resource $other")
  }

  private def parseSearchParams(params: String): Seq[String] = {
    params.split("&").flatMap { param =>
      val parts = param.split("=", 2)
      if (parts.length != 2) return Seq.empty
      val key = parts(0).trim
      val value = parts(1).trim

      // Helper: check if the field is a date
      val dateFields = Set("birthDate", "period.start", "date")
      val isDateField = dateFields.contains(key)

      value match {
        // Greater or equal
        case v if v.startsWith("ge") =>
          if (isDateField) Seq(s"$key:[${v.stripPrefix("ge")}T00:00:00Z TO *]")
          else Seq(s"$key:[${v.stripPrefix("ge")} TO *]")

        // Less or equal
        case v if v.startsWith("le") =>
          if (isDateField) Seq(s"$key:[* TO ${v.stripPrefix("le")}T23:59:59Z]")
          else Seq(s"$key:[* TO ${v.stripPrefix("le")}]")

        // Less than
        case v if v.startsWith("lt") =>
          if (isDateField) Seq(s"$key:[* TO ${v.stripPrefix("lt")}T00:00:00Z]")
          else {
            val n = v.stripPrefix("lt").toInt - 1
            Seq(s"$key:[* TO $n]")
          }

        // Greater than
        case v if v.startsWith("gt") =>
          if (isDateField) Seq(s"$key:[${v.stripPrefix("gt")}T23:59:59Z TO *]")
          else {
            val n = v.stripPrefix("gt").toInt + 1
            Seq(s"$key:[$n TO *]")
          }

        // Exact match for boolean
        case "true" | "false" if !isDateField =>
          Seq(s"$key:$value")

        // Everything else: exact match (string, code, etc.)
        case other =>
          if (isDateField) Seq(s"$key:${other}T00:00:00Z")
          else Seq(s"$key:$other")
      }
    }
  }


  private def loadMatchingPatients(criterion: Criterion): DataFrame = {
    val collection = mapResourceToCollection(criterion.Resource)
    val filters = parseSearchParams(criterion.searchParams)
    val df = connector.loadCollection(collection, filters)
    val patientDf =
      if (criterion.Resource == "Patient") {
        df.select(col("id").alias("patientId"))
      } else {
        df.filter(col("`subject.reference`").isNotNull)
          .withColumn(
            "patientId",
            regexp_replace(col("`subject.reference`"), "Patient/", "")
          )
          .select("patientId")
      }

    patientDf.distinct()
  }

  def runSearch(criteria: SearchCriteria): Long = {
    /*
     * ============================================================
     *  CONSIGNE CANDIDAT — Implémentation du coeur du moteur ici
     * ============================================================
     *
     * Objectif :
     *   Cette méthode doit exécuter une requête de "cohorte" à partir d'un ensemble
     *   de critères (SearchCriteria) et retourner le NOMBRE de patients correspondant.
     *
     *   L'implémentation attendue doit respecter les règles de gestion
     *   décrites dans le README du projet (chargement dynamique, load Solr,
     *   inclusion/exclusion, jointures).
     *
     * Contraintes et attendus (à respecter) :
     *
     * 1) Chargement dynamique des critères
     *   - Parcourir la liste des critères (Criteria) reçus dans le SearchCriteria.
     *   - Chaque critère indique une Resource (ex: "Patient", "Encounter", "DocumentReference"...).
     *   - Cette Resource doit être mappée à la collection Solr correspondante (ex: patientAphp, encounterAphp, ...).
     *   - Le moteur NE DOIT PAS être codé "en dur" pour un seul cas : il doit fonctionner
     *     quel que soit le nombre de critères et l'ordre des critères.
     *
     * 2) Filtrage Solr
     *   - Les searchParams sont exprimés dans un format FHIR simplifié.
     *   - Vous devez traduire ces paramètres en filtres Solr
     *
     * * 3) Logique Inclusion / Exclusion
     *   - Chaque critère a un flag Include (string "true"/"false").
     *   Si valeur "true" :
     *     - Conserver les patients qui possèdent AU MOINS une ressource correspondant au critère.
     *   Sinon:
     *     - Exclure les patients qui possèdent AU MOINS une ressource correspondant au critère.
     *    Lorsque plusieurs critères sont présents, la cohorte finale doit
     *       correspondre à l'INTERSECTION de ces patients satisfaisant chaque critère d'inclusion ou exclusion.
     * 4) Jointures (règle de rattachement des ressources au Patient)
     *     - Les critères sont liés par id patient
     *
     * Résultat attendu :
     *   - Retourner un Long correspondant au nombre de patients distinct.
     *
     * Important :
     *   - Le code doit rester lisible et testable.
     *   - Toute hypothèse métier doit être cohérente avec les règles du README.
     */

    if (criteria.Criteria.isEmpty) return 0L

    var currentPatients = connector.loadCollection("patientAphp")
      .withColumnRenamed("id", "patientId")
      .select("patientId")
      .distinct()

    criteria.Criteria.foreach { criterion =>
      logger.info(s"Processing criterion: ${criterion.Resource}, Include=${criterion.Include}, params=${criterion.searchParams}")

      val matchingPatients = loadMatchingPatients(criterion)

      currentPatients = criterion.Include.toLowerCase match {
        case "true" => currentPatients.join(matchingPatients, Seq("patientId"), "inner")
        case "false" => currentPatients.join(matchingPatients, Seq("patientId"), "left_anti")
        case other => throw new IllegalArgumentException(s"Unknown Include value: $other")
      }
    }

    if (criteria.Perimeters.nonEmpty) {
      val patientsWithOrg = connector.loadCollection("patientAphp")
        .withColumnRenamed("id", "patientId")
        .select("patientId", "`managingOrganization.reference`")
        .distinct()

      currentPatients = patientsWithOrg
        .join(currentPatients, Seq("patientId"), "inner")
        .filter(col( "`managingOrganization.reference`").isin(criteria.Perimeters: _*))
        .select("patientId")
    }

    currentPatients.count()

  }

  def stop(): Unit = spark.stop()
}
