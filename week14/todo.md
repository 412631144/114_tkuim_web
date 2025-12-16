# 專案計畫: Versus 仿製前端

## 1. 專案初始化 (Project Initialization)
- [ ] 建立基礎檔案結構 (`index.html`, `styles.css`, `script.js`)
- [ ] 設定基礎樣式 (Reset CSS, 字體, 變數)
- [ ] 引入必要的外部資源 (如: Google Fonts, Icons - FontAwesome 或類似)

## 2. 全域樣式 (Global Styles)
- [ ] **色彩系統**:
    - 背景色: 深黑 (`#000000`), 深灰 (`#1a1a1a`)
    - 主色調: 紫色漸層 (參考圖示 Verses 的品牌色)
    - 文字: 白色, 淺灰
- [ ] **元件樣式**:
    - 按鈕: 圓角 Pill-shape, 漸層背景
    - 輸入框: 大圓角, 內陰影或平坦設計

## 3. 頁面結構開發 (HTML Structure)
- [ ] **Header (導覽列)**
    - Logo (`Versus`)
    - 類別選單 (Dropdown)
    - 快速連結 (移動電話, 顯示卡...)
    - 右側使用者選單
- [ ] **Main Content Area (主內容區)**
    - 用於切換顯示不同視圖 (Landing, Grid, Comparison)
- [ ] **Footer** (雖然沒圖, 但預留結構)

## 4. 視圖開發 (Views Implementation)
### A. Landing View (參考圖 1)
- [ ] **Hero Section**
    - 標題: "萬物皆可比對" (大字體, 可能有白色/發光效果)
    - 副標題: 類別關鍵字連結
    - **搜尋組件**:
        - 圓角搜尋框 "在此处输入以开始比较"
        - "比较" 按鈕 (深色/高亮背景)
    - 背景: 紫色光暈特效 (CSS Radial Gradient)

### B. Grid/Category View (參考圖 2)
- [ ] **Grid Layout**: 使用 CSS Grid 實現響應式卡片排列
- [ ] **Card Components**:
    - **文章/比較卡片**: 標題 + 描述 + 圖片 (如 WhatsApp vs Signal)
    - **產品展示卡片**: 產品大圖 + 標題 + 類別 (如 Fairphone)
    - **分數/統計卡片**: 含有圓形分數圖表的樣式
- [ ] **Layout**: 包含頂部廣告 Banner 區塊

### C. Comparison Detail View (參考圖 3)
- [ ] **Comparison Header**:
    - 麵包屑 (Breadcrumbs)
    - 產品標題 (Apple AirPods 4 ANC vs Samsung Galaxy...)
- [ ] **Product Face-off**:
    - 左側產品 vs 右側產品
    - **Score Badge**: 圓形分數 (73 vs 100) - 需用 CSS 或 SVG 繪製圓環
    - 產品圖片: 去背圖或白色背景圖
    - **Action Area**: 價格顯示 ($94 Amazon), 購買按鈕
- [ ] **Sticky Bar** (底部懸浮比較條, 參考圖3右下角的按鈕樣式)

## 5. 互動與細節 (Interactions & Polish)
- [ ] Hover 效果 (卡片浮起, 按鈕變色)
- [ ] 搜尋框 Focus 狀態
- [ ] 響應式調整 (Mobile 適配)
