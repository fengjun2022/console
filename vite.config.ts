import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

import path from "path";

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 当前工作目录路径
const root: string = process.cwd();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 环境变量
  const env = loadEnv(mode, root, "");
  return {
    base: env.VITE_PUBLIC_PATH || "/",
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        },
        external: []
      }
    },
    plugins: [
      vue(),

      // 保留原有的 VueI18nPlugin
      VueI18nPlugin({
        include: resolve(__dirname, './src/i18n/locales/**'),
      }),
      // 生产环境默认不启用 CDN 加速
      // enableCDN(env.VITE_CDN_DEPS)
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      },
      extensions: [
        ".mjs",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".vue", // 原本就有
        ".worker.ts",
        ".worker.js" // 新加
      ]
    },
    server: {
      host: true,
      // 仅在 proxy 中配置的代理前缀， mock-dev-server 才会拦截并 mock
      // doc: https://github.com/pengzhanbo/vite-plugin-mock-dev-server
      proxy: {
        "/web-api": {
          target: "http://127.0.0.1:8080",
          // target: "http://139.196.53.82:8888",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/web-api/, "")
        }
      }
    }
  };
});
