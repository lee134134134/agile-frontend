import axios from "axios"; // 引用axios
import { ElMessage, ElLoading } from "element-plus";
import Cookies from "js-cookie";
let loading;
let loadingNum = 0; //初始化接口数量
// axios 配置
const Axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // 是用于请求的服务器 URL 这是调用数据接口,公共接口url+调用接口名
  timeout: 5 * 60 * 1000, // 请求超时时间 如果请求花费了超过 `timeout` 的时间，请求将被中断  单位：ms
  headers: {
    // 自定义请求头
    "Content-type": "application/json; charset=UTF-8",
  },
});
Axios.interceptors.request.use(
  function (config) {
    loading = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(255, 255, 255, 0)",
    });
    // 假设你想提升所有ElLoading的层级
    const loadingMasks = document.querySelectorAll(".el-loading-mask");
    loadingMasks.forEach((mask) => {
      mask.style.zIndex = "99999";
    });
    if (config.headers.isLoading != false) {
      loadingNum++; //记录需要加载动画的接口数量
    }
    return config;
  },
  function (error) {
    loading.close();
    return Promise.reject(error);
  }
);

// http response 返回拦截器
Axios.interceptors.response.use(
  (response) => {
    const code = response.data.code || 200;
    if (code && code === "00000") {
      if (response.data.msg) {
        ElMessage({
          message: response.data.msg,
          type: "success",
          offset: 100,
        });
      }
    } else {
      // ElMessage.error(response.data.msg)
    }
    if (response.config.headers.isLoading == false) {
    } else {
      loadingNum--;
      if (loadingNum == 0) {
        loading.close();
      }
    }
    return response.data;
  },
  (error) => {
    loadingNum = 0; //遇到一个报错 则所有的动画都结束
    loading.close();
    return Promise.reject(error.response);
  }
);

export default Axios;
