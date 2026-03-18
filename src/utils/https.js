import axios from "./http.js";
import noloadAxios from "./noLoadHttp.js";
const $http = {
  // get
  get(url, params, callback) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          callback ? resolve(callback(res)) : resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // noloadgit
  noload_get(url, params, callback) {
    return new Promise((resolve, reject) => {
      noloadAxios
        .get(url, {
          params: params,
        })
        .then((res) => {
          callback ? resolve(callback(res)) : resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // post
  post(url, params, callback) {
    return new Promise(async (resolve, reject) => {
      const startTime = Date.parse(new Date());
      await axios
        .post(url, params)
        .then((res) => {
          const endTime = Date.parse(new Date());
          if (endTime - startTime == 0) {
            setTimeout(() => {
              callback ? resolve(callback(res)) : resolve(res);
            }, 320);
            return;
          }
          callback ? resolve(callback(res)) : resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //noload-post
  noload_post(url, params, callback) {
    return new Promise(async (resolve, reject) => {
      const startTime = Date.parse(new Date());
      await noloadAxios
        .post(url, params)
        .then((res) => {
          const endTime = Date.parse(new Date());
          if (endTime - startTime == 0) {
            setTimeout(() => {
              callback ? resolve(callback(res)) : resolve(res);
            }, 320);
            return;
          }
          callback ? resolve(callback(res)) : resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // put
  put(url, params, callback) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params, {
          headers: {
            "content-type": "multipart/form-data",
          },
          data: params,
        })
        .then(
          (res) => {
            callback ? resolve(callback(res)) : resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  },
  noload_getBlob(url, params, callback) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          responseType: "blob",
          params: params,
        })
        .then((res) => {
          callback ? resolve(callback(res)) : resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
export default $http;
