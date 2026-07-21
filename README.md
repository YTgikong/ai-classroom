# 🎓 YT老師的AI小教室

一個為學生打造的 AI 提示詞學習平台，幫助長輩和初學者輕鬆學習 ChatGPT。

## ✨ 功能特色

### 📚 六大分類
- **個人形象** - 自我介紹、社群貼文、品牌塑造
- **簡報常用** - 簡報結構、開場詞、視覺化建議
- **工作生產力** - 會議記錄、Email、待辦事項管理
- **知識學習** - 快速學習、考試準備、筆記整理
- **自我成長** - 優勢整理、目標規劃、反思紀錄
- **生圖Prompt** - AI 繪圖提示詞庫（支持圖片預覽）

### 🎯 核心功能
- ✅ 一鍵複製提示詞
- ✅ 莫蘭迪色調設計（柔和低飽和度）
- ✅ 完全響應式設計（手機優化）
- ✅ 無需登入即可使用
- ✅ 簡易後台管理系統
- ✅ 本地存儲（LocalStorage）
- ✅ 生圖示例圖片預覽

## 🚀 快速開始

### 本地運行
1. 克隆此項目
```bash
git clone https://github.com/YTgikong/yt-ai-classroom.git
cd yt-ai-classroom
```

2. 用瀏覽器打開 `index.html`
```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

### 後台管理登入
- **URL**: 點擊頁面右上角「管理員」按鈕
- **預設密碼**: `12345`（首次登入後建議在後台點擊「🔑 變更密碼」立即更改）
- **功能**: 新增、編輯、刪除提示詞和圖片、變更管理密碼

> ⚠️ 密碼僅以 SHA-256 雜湊比對並存放於瀏覽器 localStorage，屬於前端輕量防呆機制，
> 無法抵禦熟悉開發者工具的使用者。若需要真正的權限控管，仍需搭配後端驗證。

## 📖 使用指南

### 學生用戶
1. 選擇分類（上方菜單）
2. 瀏覽提示詞卡片
3. 點「📋 複製提示詞」
4. 打開 ChatGPT 貼上並修改

### 管理員用戶
1. 點擊「管理員」按鈕
2. 輸入密碼登入
3. 新增/編輯/刪除提示詞
4. 對於「生圖Prompt」分類，支持添加圖片 URL
5. 所有改動自動保存

## 🎨 設計特點

### 色系（莫蘭迪配色）
- 個人形象: #C8A8A8
- 簡報常用: #B8A89E
- 工作生產力: #8BA0A8
- 知識學習: #9E8BA0
- 自我成長: #8E9E88
- 生圖Prompt: #A89BA0
- 背景色: #EAE6E1

### 字型和排版
- 字級: 最小 12px
- 按鈕高度: 最小 48px
- 響應式網格: 自適應 280px 卡片
- 無廣告、無複雜菜單

## 💾 數據存儲

所有提示詞存儲在瀏覽器 LocalStorage 中：
- 自動保存所有編輯
- 跨會話保留數據
- 可導出為 JSON（在後台手動操作）

## 🔐 安全性

- ✅ 無需個人信息
- ✅ 不上傳任何數據到伺服器
- ✅ 本地密碼保護後台
- ✅ 安全提醒已內置

## 🌐 在線部署

### 使用 Zeabur 部署（推薦）
見 [部署指南](#zeabur-部署指南)

### 其他部署方式
- GitHub Pages（靜態）
- Netlify（靜態）
- Vercel（靜態）
- 任何支持靜態 HTML 的伺服器

## 📝 Zeabur 部署指南

### 前置準備
1. GitHub 帳號
2. Zeabur 帳號（[註冊](https://zeabur.com)）

### 步驟一：GitHub 設置
```bash
# 初始化 git 倉庫
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: YT AI Classroom"

# 添加遠端倉庫（替換為你的倉庫 URL）
git remote add origin https://github.com/YOUR_USERNAME/yt-ai-classroom.git

# 推送
git push -u origin main
```

### 步驟二：Zeabur 部署
1. 訪問 https://zeabur.com
2. 登入你的 Zeabur 帳號
3. 點擊「New Project」
4. 選擇 GitHub 倉庫 `yt-ai-classroom`
5. 自動部署完成！

### 步驟三：設置域名
1. 在 Zeabur 項目設置中找到「Domain」
2. 添加自訂域名（如 `ai-classroom.holang.tw`）
3. 按照指示配置 DNS

## 📦 文件結構

```
yt-ai-classroom/
├── index.html          # 主應用文件
├── README.md           # 項目文檔
├── .gitignore          # Git 忽略文件
└── LICENSE             # MIT 許可證
```

## 🛠 技術棧

- **前端**: Pure HTML + CSS + JavaScript
- **存儲**: Browser LocalStorage
- **樣式**: 原生 CSS（無框架依賴）
- **部署**: Zeabur / GitHub Pages

## 📄 許可證

MIT License - 詳見 [LICENSE](LICENSE)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 👨‍🏫 關於作者

**YT老師 (許鈺婷)**
- 🎓 IT Project Manager + AI Educator
- 📍 持證: PMP, CBAP
- 🌐 [個人品牌網站](https://holang.tw)

---

**問題回報**: 在 GitHub Issues 提交

**更新日誌**: 見 [CHANGELOG](CHANGELOG.md)
