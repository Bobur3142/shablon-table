import axios, { type AxiosInstance } from 'axios';
import {boot} from "quasar/wrappers";
import {base_lang, url_http} from "boot/constants";
import {piniaState} from "stores/piniaState";
import {push} from "notivue";
import {piniaActions} from "stores/piniaActions";
import {useRouter} from "vue-router";

const router = useRouter()


declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create();
let $axios = axios;

let is401Handled = false;
let catchedNetworkError: boolean = false

export default boot(({ app }) => {
  axios.defaults.timeout = url_http.BASE_TIMEOUT;
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = url_http.BASE_URL;

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {

      if (error.response?.data instanceof ArrayBuffer) {
        try {
        } catch (e) {
          console.error(e)
        }
      }

      if (error.code === 'ERR_NETWORK') {
        if (catchedNetworkError) return Promise.reject()
        catchedNetworkError = !catchedNetworkError

        return Promise.reject({
          type: "warning",
          errorCode: 401,
          errorDescription: "",
          errorMessage: 'Нет подключения к интернету',
        });
      }

      if (error.response?.status === 401) {
        if (!is401Handled) {
          is401Handled = true;
          piniaActions().clearUserSession();
          await router.push({name: "landing"})
        }
      }

      if (error.response?.data) {
        const errorData = error.response.data as { ERROR?: { message: string, description?: string } };
        if (!errorData || !errorData.ERROR) return;
        if (errorData.ERROR?.message) push.error({
          title: errorData.ERROR?.message || "",
          message: errorData.ERROR?.description || "",
        })
      }
      return Promise.reject(error);
    }
  );

  axios.interceptors.request.use(
    function (request) {
      if (piniaState().auth !== null) {
        request.headers.Authorization = `Bearer ${piniaState().auth.token}`;
      }

      request.headers["Accept-Language"] = localStorage.getItem("language") || base_lang.code;
      return request;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  $axios = axios;
});

export { api, $axios, axios };
