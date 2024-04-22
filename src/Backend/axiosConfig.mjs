// src/axiosConfig.js
import axios from "axios";
const apiUrl =
	process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: process.env.REACT_APP_API_URL; // Production API URL from environment variables

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
