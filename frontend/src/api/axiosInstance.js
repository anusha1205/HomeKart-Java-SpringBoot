// // src/api/axiosInstance.js
// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8080/api',
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;


import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // ✅ correct backend base
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
