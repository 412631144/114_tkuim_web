# Week 12 課程筆記與測試說明

本專案包含 Week 12 的伺服器端程式碼。

## 1. 啟動方式 (Start Server)

請先確認已安裝 Node.js 與 MongoDB。

### 安裝依賴 Wait
```bash
cd server
npm install
```

### 啟動伺服器
```bash
npm run dev
# Server running at http://localhost:3002
```

## 2. 測試方式 (Run Tests)

本專案使用 VS Code 的 **REST Client** 擴充套件進行測試。

1. 安裝 VS Code 擴充套件: `REST Client` (humao.rest-client)。
2. 開啟檔案 `tests/api.http`。
3. 點擊測試腳本上方的 `Send Request` 按鈕即可執行測試。

### 測試流程 (Test Scenarios)
`tests/api.http` 包含以下測試案例：

1. **未登入被拒 (Unauthorized)**: 嘗試在未帶 Token 情況下存取受保護 API，預期回傳 401。
2. **登入成功 (Login Success)**: 使用 `Student` 與 `Admin` 帳號登入取得 Token。
3. **權限不足 (Forbidden)**: 
    - 使用 `Admin` 建立一筆資料。
    - 使用 `Student` 的 Token 嘗試刪除該筆資料，預期回傳 403 (權限不足)。
4. **刪除成功 (Delete Success)**:
    - 使用 `Student` 建立一筆資料。
    - 使用 `Student` 的 Token 刪除該筆資料，預期回傳 200 (成功)。

## 帳號列表

### 管理者帳號（Admin）

Email: admin@example.com

Password: week12-pass

Role: admin

### 學生帳號（Student）

Email: student@example.com

Password: 123

Role: student
