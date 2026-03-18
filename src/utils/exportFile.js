import axios from "axios";
const NODE_ENV = import.meta.env.VITE_BASE_URL;
import { ElMessage } from "element-plus";

export default function exportFile(url, options = {}, callback) {
  return new Promise((resolve, reject) => {
    axios.defaults.headers["content-type"] = "application/json;charset=UTF-8";
    axios.defaults.headers["Content-disposition"] = "attachment";
    axios.defaults.headers["Access-Control-Expose-Headers"] = "Authorization";

    const cookies = document.cookie;
    const cookieArray = cookies.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].trim();
      const [name, value] = cookie.split("=");
      // 判断是否找到需要的cookie
      if (name === "agiles_token") {
        axios.defaults.headers["Authorization"] = `Bearer ${value}`;
      }
    }
    const baseURL = NODE_ENV + url;

    axios({
      method: "post",
      // url: `${DOMAIN}${url}`, // 请求地址
      url: baseURL, // 请求地址
      data: options, // 参数
      responseType: "blob", // 表明返回服务器返回的数据类型
    }).then(
      (response) => {
        console.log("response", response);

        let blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        });
        // console.log(blob);
        let fileName = decodeURIComponent(response?.headers?.filename);
        if (!fileName) {
          ElMessage({
            message: `未获取到文件`,
            type: "error",
          });
          return;
        }
        if (window.navigator.msSaveOrOpenBlob) {
          // console.log(2)
          navigator.msSaveBlob(blob, fileName);
        } else {
          // console.log(3)
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          //释放内存
          window.URL.revokeObjectURL(link.href);
        }
        resolve(response.status);

        callback ? resolve(callback(response)) : resolve(response);
      },
      (err) => {
        reject(err);
      }
    );
  }).then((res) => {
    // console.log(" new promise res", res);
  });
}

export function exportGetFile(url, options = {}, callback) {
    return new Promise((resolve, reject) => {
        axios.defaults.headers["content-type"] = "application/json;charset=UTF-8";
        axios.defaults.headers["Content-disposition"] = "attachment";
        axios.defaults.headers["Access-Control-Expose-Headers"] = "Authorization";

        const cookies = document.cookie;
        const cookieArray = cookies.split(";");
        for (let i = 0; i < cookieArray.length; i++) {
            const cookie = cookieArray[i].trim();
            const [name, value] = cookie.split("=");
            // 判断是否找到需要的cookie
            if (name === "agiles_token") {
                axios.defaults.headers["Authorization"] = `Bearer ${value}`;
            }
        }
        const baseURL = NODE_ENV + url;

        axios({
            method: "get",
            // url: `${DOMAIN}${url}`, // 请求地址
            url: baseURL, // 请求地址
            data: options, // 参数
            responseType: "blob", // 表明返回服务器返回的数据类型
        }).then(
            (response) => {
                console.log("response", response);

                let blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                // console.log(blob);
                let fileName = options.name;
                if (!fileName) {
                    ElMessage({
                        message: `未获取到文件`,
                        type: "error",
                    });
                    return;
                }
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    // console.log(3)
                    var link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    //释放内存
                    window.URL.revokeObjectURL(link.href);
                }
                resolve(response.status);

                callback ? resolve(callback(response)) : resolve(response);
            },
            (err) => {
                reject(err);
            }
        );
    }).then((res) => {
        // console.log(" new promise res", res);
    });
}