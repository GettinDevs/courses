import axios, { AxiosResponse, AxiosError } from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.timeout = 5000;

function responseHandler(response: AxiosResponse) {
  console.log(response.data)
  return response.data;
}

function errorHandler(error: AxiosError) {
  console.error(error)
  return Promise.reject(error);
}

export const post = (url: string, data?: any) => axios.post(url, data).then(responseHandler).catch(errorHandler)
export const put = (url: string, data?: any) => axios.put(url, data).then(responseHandler).catch(errorHandler)
export const get = (url: string) => axios.get(url).then(responseHandler).catch(errorHandler)
export const del = (url: string) => axios.delete(url).then(responseHandler).catch(errorHandler)