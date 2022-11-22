import axios from "axios";
import { setLoading } from "../redux/actions/commonAction";
import { store } from "../redux/store";

axios.defaults.baseURL = "http://localhost:8000";

// axios.defaults.headers

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    store.dispatch(setLoading(true));
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    store.dispatch(setLoading(false));
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);
