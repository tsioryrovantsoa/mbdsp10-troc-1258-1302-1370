import axios from 'axios';

// export const instance = axios.create({
//   baseURL: 'http://10.0.1.83:8080/api/',
//   timeout: 1000,
//   headers: {'Authorization': `Bearer ${token}`}
// });

export const baseURL = "http://192.168.1.235:8080/";
export const baseExpressURL = "http://192.168.1.235:3001/";

export const imageURL = baseURL + "public/uploads/";

export default class ApiService {
    static contentTypeFormData = "multipart/form-data";
    static contentTypeJson = "application/json";
  
    static getHeaders = (token:string) => {
      return {
        "Content-Type": ApiService.contentTypeJson,
        Authorization: `Bearer ${token}`,
      };
    };
  
    static getHeadersFormData = (token:string) => {
      return {
        "Content-Type": ApiService.contentTypeFormData,
        Authorization: `Bearer ${token}`,
      };
    };
  
    static postFormData = async (
      url:string,
      data:any,
      token = "",
      params = {}
    ) => {
      return axios({
        method: "POST",
        url,
        headers: this.getHeadersFormData(token),
        data,
        ...params,
      });
    };
  
    static post = async (url:string, data:any, token = "") => {
      return axios({
        method: "POST",
        url,
        headers: ApiService.getHeaders(token),
        data: JSON.stringify(data),
      });
    };
  
    static get = async (url:string, token = "") => {
      return await axios({
        method: "GET",
        url,
        headers: ApiService.getHeaders(token),
      }).catch((err: { response: { status: number; } | undefined; config: { url: any; }; }) => {
        if (err.response !== undefined && err.response.status === 404) {
          throw new Error(`${err.config.url} not found`);
        }
        throw err;
      });
    };
  
    static delete = async (url:string, token = "") => {
      return axios({
        method: "DELETE",
        url,
        headers: ApiService.getHeaders(token),
      });
    };
  
    static put = async (url:string, data:any, token = "") => {
      return axios({
        method: "PUT",
        url,
        headers: ApiService.getHeaders(token),
        data: JSON.stringify(data),
      });
    };
  }