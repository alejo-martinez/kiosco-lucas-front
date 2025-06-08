import axios from "axios"

const url = process.env.NEXT_PUBLIC_URL_BACK;

const api = axios.create({
    baseURL: url,
    timeout:15000,
    withCredentials:true
})

export default api;