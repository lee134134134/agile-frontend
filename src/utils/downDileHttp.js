import axios from "axios"; // 引用axios
import { ElMessage, ElLoading } from "element-plus";
import router from "../router/index.js";
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
    const cookies = document.cookie;
    const cookieArray = cookies.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].trim();
      const [name, value] = cookie.split("=");
      // 判断是否找到需要的cookie
      if (name === "agiles_token") {
        config.headers.Authorization = `Bearer ${value}`;
      }
    }
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
    if (error.response && error.response.status === 403) {
      // 处理403错误，例如重定向到登录页面或显示错误消息
      ElMessage.warning("当前登录已失效，请重新登录!");
      Cookies.remove("agiles_token");
      Cookies.remove("agiles_tokenType");
      localStorage.removeItem("agiles_token");
      localStorage.removeItem("agiles_tokenType");
      localStorage.removeItem("agiles_user");
      localStorage.removeItem("agiles_userInfo");
      localStorage.removeItem("agiles_router");
      localStorage.removeItem("agiles_menuList");
      // 可以选择重定向到登录页面或显示提示信息等
      router.push("/login"); // 如果你使用的是Vue Router
    }
    return Promise.reject(error);
  }
);

export default Axios;
