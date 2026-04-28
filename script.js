const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const MODEL_NAME = "qwen3.6-plus";

let messages = [
  {
    role: "system",
    content:
      "你是一个中文学习笔记整理助手。你需要帮助用户把课程笔记整理成摘要、知识点、复习问题、表格或考试复习版。回答要清晰、结构化、适合学生复习。"
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

sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", clearChat);

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

  if (!content) {
    showError("请输入学习笔记、问题或修改建议。");
    return;
  }

  messages.push({ role: "user", content });
  userInput.value = "";
  renderChat();

  setLoading(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages,
        temperature: 0.7
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
        "你是一个中文学习笔记整理助手。你需要帮助用户把课程笔记整理成摘要、知识点、复习问题、表格或考试复习版。回答要清晰、结构化、适合学生复习。"
    }
  ];
  userInput.value = "";
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
    .map((message) => {
      const roleName = message.role === "user" ? "你" : "AI助手";
      return `
        <div class="message ${message.role}">
          <span class="role">${roleName}</span>
          ${escapeHtml(message.content)}
        </div>
      `;
    })
    .join("");

  chatBox.scrollTop = chatBox.scrollHeight;
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
