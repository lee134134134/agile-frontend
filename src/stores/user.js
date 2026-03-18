import { defineStore } from "pinia";
import { getUserInfo } from "@/api/api.js";
import router from "@/router";

export const useUserStore = defineStore("user", {
  state: () => ({
    userName: "",
    nickname: "",
    menus: [],
    routers: [],
    rolesCode: [],
  }),

  actions: {
    getUserInfoFn() {
      return getUserInfo().then((res) => {
        localStorage.setItem("agiles_userInfo", JSON.stringify(res.data));
        this.userName = res.data?.name ?? "";
        this.nickname = res.data?.nickname ?? "";
        this.routers = res.data?.featureVos ?? [];
        this.rolesCode = res.data?.rolesCode ?? [];
        localStorage.setItem(
          "agiles_router",
          JSON.stringify(res.data?.featureVos)
        );
      });
    },
  },
});
