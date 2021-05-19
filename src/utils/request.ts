import axios from "axios";
import {baseUrl} from "@/utils/store";


const service = axios.create({
    // baseURL: baseUrl.value,
    baseURL: '/',
    timeout: 1000000,
})
service.defaults.headers.post['Content-Type'] = 'application/json';

service.interceptors.request.use(config => {
    // config.baseURL = baseUrl.value
    // if (config.url === '/api/parse') {
    //     config.baseURL = '/'
    // }
    if (config.url !== '/api/parse') {
        config.baseURL = baseUrl.value
    }
    return config
}, error => {
    return Promise.reject(error);
})


service.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error)
})

export default {
    get(url: string, params = {}) {
        return new Promise((resolve, reject) => {
            service.get(url, {params})
                .then(res => resolve(res.data))
                .catch(err => reject(err))
        })
    },
    post(url: string, params= {}) {
        return new Promise((resolve, reject) => {
            service.post(url, params)
                .then(res => resolve(res.data))
                .catch(err => reject(err))
        })
    }
}
