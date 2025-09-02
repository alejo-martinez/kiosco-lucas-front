export const extractTenantFromHost = (hostname) => {
    if (!hostname) return "";
    const h = hostname.toLowerCase();

    // kiosco1-tuapp.vercel.app => "kiosco1"
    if (h.includes("-") && h.endsWith(".vercel.app")) {
        return h.split(".")[0].split("-")[0];
    }
    return h.split(".")[0]; // subdominio clásico
}
