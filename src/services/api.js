import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:44358/api/v1',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

export default api;
