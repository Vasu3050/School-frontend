import axios from 'axios';

const API = axios.create(
    {
        baseURL: 'http://localhost:3000/api/v1',
        withCredentials : true,
        headers: {
            "Content-Type": "application/json",
          },
    }
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    }
  );
  
  export default API;

