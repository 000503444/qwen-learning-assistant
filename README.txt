AI学习笔记整理助手

一、项目说明
本项目是一个纯前端 Web LLM 应用，使用 HTML + CSS + JavaScript 编写。
用户输入阿里云百炼 API Key 后，可以调用 qwen3.6-plus 模型整理学习笔记，并支持多轮修改。

二、文件说明
index.html    页面结构
style.css     页面样式
script.js     交互逻辑与模型调用
README.txt    运行说明

三、运行方式
方法1：直接双击 index.html，在浏览器中打开。
方法2：上传到 GitHub Pages 或 OSS 静态网站托管后访问。

四、使用说明
1. 打开网页。
2. 输入自己的阿里云百炼 API Key。
3. 在输入框中输入学习笔记或修改建议。
4. 点击“生成 / 继续修改”。
5. 如需重新开始，点击“清空对话”。

五、密钥安全说明
本项目不会在代码中保存 API Key。
API Key 只在当前浏览器页面中使用，不会写入 index.html、style.css 或 script.js。
提交 GitHub 仓库前，请确认没有上传任何包含密钥的截图或文件。
