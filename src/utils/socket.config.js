import { io } from 'socket.io-client';

import { extractTenantFromHost } from './tenant';

const urlBack = process.env.NEXT_PUBLIC_URL_BACK

const getTenant = () => {
    if (typeof window !== "undefined") {
        return extractTenantFromHost(window.location.hostname);
    }
    return ""; // en SSR no conectamos socket
}


const socket = io(urlBack, {
    withCredentials: true,
    extraHeaders: {
        "X-Tenant-Id": getTenant(),
    },
});

export default socket;