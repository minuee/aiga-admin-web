import axios, { AxiosResponse } from 'axios';

export type ApiResponse<T> = Promise<AxiosResponse<T>>;
type State = 'true' | 'false';
export type ServiceResponse<T> = {
  state: State;
} & T;

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:9999';

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  function (config) {
    config.baseURL = baseURL;
    return config;
  },
  function (error) {
    console.log('request error : ', { error });
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  res => {
    if (res.status === 200) {
      if (res.data.state === 'false') {
      }
    }else{
      // Toast(res?.data?.message? res.data.message : '오류가 발생하였습니다.')
    }
    return res;
  },
  err => {
    const response = err.response;
    if (response) {
      let message = response.data ? response.data.message : response.message;
      console.log({
        statusCode: response.data.statusCode,
        message: message,
      });
    } else {
      console.log('response err : ', { err });
    }
    return Promise.reject(err);
  },
);

export const bearer = (authToken: string) => `Bearer ${authToken}`;

export const multipart = { 'Content-Type': 'multipart/form-data' };

export const api = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
