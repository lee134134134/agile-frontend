import axios from "axios"; // 引用axios
import { ElMessage } from "element-plus";
import router from "../router/index.js";
import Cookies from "js-cookie";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // 是用于请求的服务器 URL 这是调用数据接口,公共接口url+调用接口名
  timeout: 5 * 60 * 1000, // 请求超时时间 如果请求花费了超过 `timeout` 的时间，请求将被中断  单位：ms
  headers: {
    // 自定义请求头
    // 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    "Content-type": "application/json; charset=UTF-8",
  },
});
// 请求拦截可以携带token等一些信息发送给后台，可以在响应拦截里面监听后台返回的状态码，进行数据处理和特定的路由跳转
// 添加请求拦截器
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
    return config;
  },
  function (error) {
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
      ElMessage.error(response.data.msg);
    }
    return response.data;
  },
  (error) => {
    //对响应错误做点什么，例如403错误处理
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
