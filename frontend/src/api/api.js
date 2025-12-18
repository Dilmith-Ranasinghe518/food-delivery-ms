import axios from "axios";

export const authApi = axios.create({
  baseURL: "http://localhost:4000"
});

export const orderApi = axios.create({
  baseURL: "http://localhost:6001"
});

export const deliveryApi = axios.create({
  baseURL: "http://localhost:7001"
});

