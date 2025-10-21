import Axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig
} from "axios";
import { ContentTypeEnum, ResultEnum } from "@/enums/requestEnum";
// import NProgress from "../progress";

import { useUserStore } from "@/stores/modules/useUserStore"
import router from "@/router";
import { useMessage } from 'naive-ui'
import { Result } from '@/type'

const message = useMessage()
// 默认 axios 实例请求配置
const configDefault = {
  headers: {
    "Content-Type": ContentTypeEnum.JSON
  },
  timeout: 0,
  baseURL: import.meta.env.VITE_BASE_API,
  data: {}
};

class Http {
  // 当前实例
  private static axiosInstance: AxiosInstance;
  // 请求配置
  private static axiosConfigDefault: AxiosRequestConfig;

  constructor(config: AxiosRequestConfig) {
    Http.axiosConfigDefault = config;
    Http.axiosInstance = Axios.create(config);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  // 通用请求函数
  public request<T>(paramConfig: AxiosRequestConfig): Promise<T> {
    const config = { ...Http.axiosConfigDefault, ...paramConfig };
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 请求拦截
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      config => {
        // NProgress.start();
        const userStore = useUserStore();

        // 发送请求前，可在此携带 token
        if (userStore.token) {
          config.headers["Authorization"] = "Bearer " + userStore.token;
        }
        return config;
      },
      (error: AxiosError) => {
        message.error(error.message);
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    Http.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // NProgress.done();
        // 与后端协定的返回字段
        const { code, msg } = response.data;
        // 判断请求是否成功
        const isSuccess = code === ResultEnum.SUCCESS;
        if (isSuccess) {
          return response.data;
        } else {
            message.error(msg);
            return response.data
        }
      },
      (error: any) => {
        console.log(error);
        const userStore = useUserStore();
        // NProgress.done();
        // 处理 HTTP 网络错误
        let msg = error.response?.data.msg;
        // HTTP 状态码
        const status = error.response?.data.code;
        // 处理请求错误
        if (status==4001) {
          userStore.cleanUserInfo();
          router.push("/login");
          message.error(msg);
          return Promise.reject(error.response?.data);
        }
        message.error(msg);
        return Promise.reject(error);
      }
    );
  }
}

export const http = new Http(configDefault);
