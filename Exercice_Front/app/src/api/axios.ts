import axios from "axios";

export const api = axios.create({
    baseURL: "/api", // all requests go through proxy
    headers: {
        "Content-Type": "application/json",
    },
});

