import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import { tracker } from "@/utils/tracker.js"
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import useThemeColor from "./utils/useThemeColor";
import "./assets/css/common.scss";
import "./assets/css/main.scss";
import "./assets/css/base.scss";
import $http from "@/utils/https.js";
import VxeUIAll from 'vxe-pc-ui'
import 'vxe-pc-ui/es/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/es/style.css'
import VxeUIGantt from 'vxe-gantt'
import 'vxe-gantt/lib/style.css'

const { appearance } = useThemeColor();
const app = createApp(App);
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.config.globalProperties.$http = $http;
app.config.globalProperties.$router = router;
window.$http = $http;
window.$router = router;
app.use(createPinia());
app.use(router);
// app.use(appearance)
app.use(ElementPlus, { locale: zhCn });
app.use(VxeUIAll).use(VxeUITable).use(VxeUIGantt)
app.mount("#app");
