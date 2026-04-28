AI学习笔记整理助手（90+优化版）

一、项目说明
本项目是一个纯前端 Web LLM 应用，使用 HTML + CSS + JavaScript 编写。
用户输入阿里云百炼 API Key 后，可以调用 qwen3.6-plus 模型整理学习笔记，并支持多轮修改。

二、功能
1. API Key 输入框
2. 用户学习笔记输入区
3. 生成/继续修改按钮
4. 模型回复显示区
5. 加载中提示
6. 错误提示
7. 清空对话按钮
8. 多轮上下文对话
9. 快捷指令
10. 示例笔记填入
11. 回复复制
12. 字数统计
13. Markdown 渲染
14. 表格美化显示
15. 最近历史对话优化
16. 输出长度控制
17. sk- Key 类型检查


三、文件说明
index.html    页面结构
style.css     页面样式
script.js     交互逻辑与模型调用
README.txt    运行说明

四、运行方式
方法1：直接双击 index.html，在浏览器中打开。
方法2：上传到 GitHub Pages 或 OSS 静态网站托管后访问。

五、密钥安全说明
本项目不会在代码中保存 API Key。
API Key 只在当前浏览器页面中使用，不会写入 index.html、style.css 或 script.js。
提交 GitHub 仓库前，请确认没有上传任何包含密钥的截图或文件。
