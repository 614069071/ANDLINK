import axios from "axios";

// axios.interceptors.request.use(config => {
//   return config;
// }, err => Promise.reject(err));

axios.interceptors.response.use(response => {
  if (response.data.code == 0) {
    return response.data;
  }
  return Promise.reject(response.data);
}, err => {
  return Promise.reject(err);
});

export default axios;
