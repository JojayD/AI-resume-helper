// src/axiosConfig.js
import axios from "axios";
const apiUrl = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : import.meta.env.VITE_API_URL; // Production API URL from environment variables


axios.defaults.baseURL = apiUrl;
axios.interceptors.request.use(
	function (config) {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

export default axios;
