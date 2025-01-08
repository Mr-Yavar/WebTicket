import API_BASE_URL from "@/config/appConfig";
import { baseFetch } from "./BaseService";


const ApiService = {
  fetchData(param) {
    return new Promise((resolve, reject) => {
      baseFetch(API_BASE_URL, param.url, param)
        .then((response) => {
          resolve(response);
        })
        .catch((errors) => {
          reject(errors);
        });
    });
  },
};

export default ApiService;
