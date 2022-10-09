import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL+'/api';

export const $host = axios.create({
    baseURL:API_URL
});

export const $authHost = axios.create({
    baseURL:API_URL
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token') || ''}`;
    return config;
}

$authHost.interceptors.request.use(authInterceptor);
