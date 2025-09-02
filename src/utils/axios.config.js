import axios from "axios";

import { extractTenantFromHost } from "./tenant";

const url = process.env.NEXT_PUBLIC_URL_BACK;

let getHeaders = null;
if (typeof window === "undefined") {
    // next/headers solo existe en server
    const mod = require("next/headers");
    getHeaders = mod.headers;
}

const getTenant = () => {
    if (typeof window !== "undefined") {
        // Client side
        return extractTenantFromHost(window.location.hostname);
    } else if (getHeaders) {
        // Server side
        const host = getHeaders().get("host") || "";
        return extractTenantFromHost(host);
    }
    return "";
}

const api = axios.create({
    baseURL: url,
    timeout: 15000,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const tenant = getTenant();

    if (tenant) {
        config.headers["X-Tenant-Id"] = tenant === 'localhost' ? 'kiosco-test' : tenant;
    }
    return config;
});

export default api;