import axios from "axios";

const service = axios.create({
    baseURL: '/',
    timeout: 1000000,
})
service.defaults.headers.post['Content-Type'] = 'application/json';

// service.interceptors.request.use(config => {
//     const token = localStorage.getItem('token')
//     if (token) {
//         config.headers.Authorization = 'Bearer ' + token
//     } else {
//         config.headers['token'] = ''
//     }
//     return config
// }, error => {
//     return Promise.reject(error);
// })
//
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
