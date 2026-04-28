const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const MODEL_NAME = "qwen3.6-plus";

let messages = [
  {
    role: "system",
    content:
      "你是一个中文学习笔记整理助手。你需要帮助用户把课程笔记整理成摘要、知识点、复习问题、表格或考试复习版。回答要清晰、结构化、适合学生复习。用户要求表格时，请使用标准 Markdown 表格格式。"
  }
];

const apiKeyInput = document.getElementById("apiKey");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorBox");
const chatBox = document.getElementById("chatBox");
const roundCount = document.getElementById("roundCount");
const charCount = document.getElementById("charCount");

sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", clearChat);

userInput.addEventListener("input", updateCharCount);

userInput.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const apiKey = apiKeyInput.value.trim();
  const content = userInput.value.trim();

  hideError();

  if (!apiKey) {
    showError("请先输入阿里云百炼 API Key。注意：不要把 API Key 写入代码或提交文件。");
    return;
  }

  if (!apiKey.startsWith("sk-")) {
    showError("请使用阿里云百炼 DashScope 的 sk- 开头 API Key，不要使用 RAM AccessKeyId/Secret。");
    return;
  }

  if (!content) {
    showError("请输入学习笔记、问题或修改建议。");
    return;
  }

  messages.push({ role: "user", content });
  userInput.value = "";
  updateCharCount();
  renderChat();

  setLoading(true);

  try {
    const recentMessages = [messages[0], ...messages.slice(-8)];

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: recentMessages,
        temperature: 0.6,
        max_tokens: 800
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const detail = data?.error?.message || data?.message || "请求失败，请检查 API Key、网络或模型权限。";
      throw new Error(detail);
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("模型没有返回有效内容，请稍后重试。");
    }

    messages.push({ role: "assistant", content: reply });
    renderChat();
  } catch (error) {
    messages.pop();
    renderChat();
    showError(error.message || "发生未知错误。");
  } finally {
    setLoading(false);
  }
}

function clearChat() {
  messages = [
    {
      role: "system",
      content:
        "你是一个中文学习笔记整理助手。你需要帮助用户把课程笔记整理成摘要、知识点、复习问题、表格或考试复习版。回答要清晰、结构化、适合学生复习。用户要求表格时，请使用标准 Markdown 表格格式。"
    }
  ];
  userInput.value = "";
  updateCharCount();
  hideError();
  renderChat();
}

function renderChat() {
  const visibleMessages = messages.filter((message) => message.role !== "system");

  roundCount.textContent = `${Math.ceil(visibleMessages.length / 2)} 轮对话`;

  if (visibleMessages.length === 0) {
    chatBox.innerHTML = '<div class="empty">还没有对话。请输入笔记后点击“生成 / 继续修改”。</div>';
    return;
  }

  chatBox.innerHTML = visibleMessages
    .map((message, index) => {
      const roleName = message.role === "user" ? "你" : "AI助手";
      const safeContent = message.role === "assistant"
        ? renderMarkdown(message.content)
        : escapeHtml(message.content).replaceAll("\n", "<br>");
      const copyButton = message.role === "assistant"
        ? `<button class="copy-btn" onclick="copyMessage(${index})">复制回复</button>`
        : "";
      return `
        <div class="message ${message.role}">
          <span class="role">${roleName}</span>
          <div class="markdown-body">${safeContent}</div>
          ${copyButton}
        </div>
      `;
    })
    .join("");

  chatBox.scrollTop = chatBox.scrollHeight;
}

function renderMarkdown(text) {
  if (window.marked) {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
    return marked.parse(text);
  }
  return escapeHtml(text).replaceAll("\n", "<br>");
}

function insertPrompt(promptText) {
  const current = userInput.value.trim();
  userInput.value = current ? `${current}\n\n${promptText}` : promptText;
  userInput.focus();
  updateCharCount();
}

function fillExample() {
  userInput.value =
    "人工智能是研究如何让机器模拟人类智能的学科。机器学习是人工智能的重要分支，主要通过数据训练模型，使模型具备预测和分类能力。神经网络由输入层、隐藏层和输出层组成，通过前向传播计算结果，通过反向传播调整参数。常见应用包括图像识别、语音识别、自然语言处理和智能推荐。请帮我整理这段笔记。";
  updateCharCount();
  scrollToInput();
}

function scrollToInput() {
  document.getElementById("inputArea").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => userInput.focus(), 350);
}

async function copyMessage(index) {
  const visibleMessages = messages.filter((message) => message.role !== "system");
  const text = visibleMessages[index]?.content || "";
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showError("已复制 AI 回复内容。");
    setTimeout(hideError, 1200);
  } catch {
    showError("复制失败，请手动选中文本复制。");
  }
}

function updateCharCount() {
  charCount.textContent = `${userInput.value.length} 字`;
}

function setLoading(isLoading) {
  loading.classList.toggle("hidden", !isLoading);
  sendBtn.disabled = isLoading;
  clearBtn.disabled = isLoading;
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderChat();
updateCharCount();
