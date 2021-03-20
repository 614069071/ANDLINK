import axios from "axios";

axios.defaults.timeout = 30000;
// axios.interceptors.request.use(config => {
//   return config;
// }, err => Promise.reject(err));

axios.interceptors.response.use(response => {
  return response.data;
}, err => {
  return Promise.reject(err);
});

export default axios;
