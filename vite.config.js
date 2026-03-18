import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ command, mode }) => {
  const { VITE_APP_TITLE, VITE_APP_PORT, VITE_BASE_URL, VITE_APP_PROXY_API, VITE_BASE_URL_AUTO, VITE_APP_PROXY_API_AUTO } =
    loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            // html title 系统标题
            title: VITE_APP_TITLE,
          },
        },
      }),
      // {
      //   name: "babel-transform",
      //   transform(code, id) {
      //     if (id.endsWith("node_modules/html-docx-js/dist/html-docx.js")) {
      //       const babel = require("@babel/core");
      //       const result = babel.transformSync(code, {
      //         plugins: ["@babel/plugin-transform-modules-commonjs"],
      //       });
      //       if (result) {
      //         return result.code;
      //       }
      //     }
      //   },
      // },
    ],
    resolve: {
      // extensions:['.svg'],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: VITE_APP_PORT,
      host: true,
      open: true,
      // 开发服务器配置自定义代理规则，请求将被代理到对应的目标
      proxy: {
        [VITE_BASE_URL]: {
          target: VITE_APP_PROXY_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(RegExp(`^${VITE_BASE_URL}`), ""), // 重写传过来的path路径
        },
        [VITE_BASE_URL_AUTO]: {
          target: VITE_APP_PROXY_API_AUTO,
          changeOrigin: true,
          rewrite: (path) => path.replace(RegExp(`^${VITE_BASE_URL_AUTO}`), ""), // 重写传过来的path路径
        },
      },
      configureWebpack: {
        resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              loader: "ts-loader",
              exclude: /node_modules/,
              options: {
                appendTsSuffixTo: [/\.vue$/],
              },
            },
          ],
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    publicPath: "./",
    build: {
      outDir: `dist`, //打包后文件夹名称 -${VITE_APP_NODE_ENV}
      // target: "esnext",
      //打包构建
      rollupOptions: {
        // external: ["html-to-docx"],
        output: {
          assetFileNames: "css/[name].[hash].css",
          chunkFileNames: "js/[name].[hash].js",
          entryFileNames: "js/[name].[hash].js",
        },
        // plugins: [
        //   {
        //     name: "transform-html-to-docx",
        //     transform(code, id) {
        //       if (id.includes("node_modules/html-to-docx")) {
        //         const { transform } = require("@babel/core");
        //         return transform(code, {
        //           presets: ["@babel/preset-env"],
        //         }).code;
        //       }
        //     },
        //   },
        // ],
      },
      // rollupOptions: {
      //   plugins: [
      //     {
      //       name: "transform-html-to-docx",
      //       transform(code, id) {
      //         if (id.includes("node_modules/html-to-docx")) {
      //           const { transform } = require("@babel/core");
      //           return transform(code, {
      //             presets: ["@babel/preset-env"],
      //           }).code;
      //         }
      //       },
      //     },
      //   ],
      // },
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 1500,
    },
    // base: '/agile-ui/'
  };
});
