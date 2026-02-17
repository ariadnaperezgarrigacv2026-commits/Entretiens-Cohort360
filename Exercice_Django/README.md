Exercice Django — API REST Patients & Médicaments (+ Prescription à implémenter)

Présentation
------------
Base de projet Django + Django REST Framework pour lister des Patients et des Médicaments.

But de l'exercice candidat: ajouter une nouvelle ressource « Prescription » avec une API REST (lecture + création + mise
à jour) et des possibilités de filtrage.


Installation des Prérequis
---------
Le projet utilise Python 3.10 et Django 4.0.
Avant tout, vous devez vous placer dans le répertoire `Exercice_Django`.

### Python et pip

- **Vérifier l'installation:**

```bash
python3 --version
pip3 --version
```

### Installation de Python et pip

**Sur Ubuntu/Debian:**

```bash
sudo apt update 
sudo apt install python3 python3-pip python3-venv
```

Installation
------------

1) Créer un environnement virtuel et installer les dépendances

```bash
python3 -m venv .venv
````

```bash
source .venv/bin/activate  #(Windows: .venv\\Scripts\\activate)
```

```bash
pip install -r requirements.txt
```

2) Initialiser la base de données

```bash
python manage.py makemigrations
```

```bash
python manage.py migrate
```

3) Générer des données fictives
   (cela peut prendre plusieurs secondes)
```bash
python manage.py seed_demo --patients 2500 --medications 150 --prescriptions 30
```

5) Lancer le serveur de développement

```bash
python manage.py runserver
```

Ouvrir http://127.0.0.1:8000/Patient et http://127.0.0.1:8000/Medication

Endpoints
---------

- GET /Patient
    - Filtres: nom | last_name, prenom | first_name, date_naissance | birth_date (YYYY-MM-DD)
- GET /Medication
    - Filtres: code, label, status (actif | suppr)

- À implémenter par le candidat: /Prescription (voir Énoncé ci‑dessous)

Exemples (curl)
---------------

- curl -s "http://127.0.0.1:8000/Patient"
- curl -s "http://127.0.0.1:8000/Patient?nom=Martin"
- curl -s "http://127.0.0.1:8000/Medication?status=actif"

Énoncé de l'exercice — Prescription
-----------------------------------
L'exercice prend la forme d'une Issue Git que pourrait donner une Product Owner du projet: [Issue-Prescriptions-001.md](Issue-Prescriptions-001.md)
L’objectif est de concevoir une nouvelle ressource REST « Prescription », destinée à la gestion des prescriptions médicamenteuses des patients.

Vous êtes libre de modifier le code existant et de proposer l’implémentation de votre choix.
Le code fourni devra respecter les bonnes pratiques de développement, être pleinement fonctionnel.
Les commentaires s'ils sont nécessaires doivent être clairs et pertinents.
