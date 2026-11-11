# 积木工坊 · Python Studio

当前版本：`v0.0.1`

中文 Blockly 图形化 Python 编程应用。拖拽积木实时生成 Python，在浏览器的独立 Web Worker 中通过 Pyodide（CPython / WebAssembly）执行。

## 本地启动

需要 Node.js 20.19+（或 22.12+）。

```bash
npm install
npm run dev
```

打开终端显示的本地地址（默认 http://127.0.0.1:5173）。

```bash
npm run build
npm run preview
```

## 功能

- 中文积木：文本、逻辑、循环、数学、列表、变量、函数。
- 实时 Python 代码、复制与 `.py` 下载。
- 独立线程运行，标准输出、错误显示、交互输入、手动停止、60 秒超时。
- 9 个积木示例：你好 Python、累加求和、奇偶判断、交互问候、发射倒计时、九九乘法表、购物清单、阶乘与平方函数。
- 浏览器自动保存、JSON 作品导入导出、撤销重做。
- 桌面双栏和窄屏上下布局。
- 拖动工具箱边缘或右侧面板分隔条调整宽度，自动记住布局；双击分隔条恢复默认，也支持聚焦后使用左右方向键调整。

依赖安装后，Python 运行资源从本地提供，无须连接 CDN。首次启动需要加载较大的 WASM 文件。每次运行使用全新的 Python 环境；输出最多显示 1000 行。

## 部署说明

`dist/` 为静态构建产物。部署须使用 HTTPS（本地 localhost 亦可），并返回以下响应头以支持交互输入使用的 SharedArrayBuffer：

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Vite 开发与预览服务器已配置。浏览器内的 Python 没有本机文件访问权限，文件系统为临时虚拟文件系统。运行环境支持 Python 标准库；本应用未提供额外第三方 Python 包安装界面。
