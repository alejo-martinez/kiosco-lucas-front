export const extractTenantFromHost = (hostname) => {
    if (!hostname) return "";

    // normalizar
    let h = hostname.toLowerCase().replace(/^https?:\/\//, ""); // quitar protocolo
    h = h.split("/")[0]; // quitar ruta

    // caso Vercel: kiosco-test.vercel.app => kiosco-test
    if (h.endsWith(".vercel.app")) {
        return h.replace(".vercel.app", "");
    }

    // subdominio clásico: kiosco1.midominio.com => kiosco1
    return h.split(".")[0];
}
