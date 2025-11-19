const form = document.querySelector('#signup-form');
const resultEl = document.querySelector('#result');
const submitBtn = form.querySelector('button[type="submit"]');
const viewListBtn = document.querySelector('#view-list-btn');

// 1. 表單送出邏輯
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // 狀態：防止重複送出 (Loading State)
  submitBtn.disabled = true;
  submitBtn.textContent = '處理中...';
  resultEl.textContent = '資料送出中...';

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  
  // 補齊後端驗證所需的額外欄位 (因為 HTML 只有基本欄位)
  payload.password = payload.confirmPassword = 'demoPass88';
  payload.interests = ['後端入門']; // 預設興趣
  payload.terms = true;

  try {
    const res = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || '送出失敗');
    }

    // 成功顯示
    resultEl.textContent = `報名成功！\nID: ${data.participant.id}\n時間: ${data.participant.createdAt}`;
    form.reset(); // 清空表單
    
  } catch (error) {
    // 錯誤顯示
    resultEl.textContent = `錯誤：${error.message}`;
  } finally {
    // 恢復按鈕狀態 (無論成功失敗)
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
  }
});

// 2. 查看報名清單邏輯 (GET)
viewListBtn.addEventListener('click', async () => {
  try {
    viewListBtn.disabled = true;
    viewListBtn.textContent = '載入中...';
    
    const res = await fetch('http://localhost:3001/api/signup');
    const data = await res.json();
    
    // 格式化顯示 JSON 結果
    resultEl.textContent = JSON.stringify(data, null, 2);
    
  } catch (error) {
    resultEl.textContent = `無法取得清單：${error.message}`;
  } finally {
    viewListBtn.disabled = false;
    viewListBtn.textContent = '查看目前報名清單';
  }
});