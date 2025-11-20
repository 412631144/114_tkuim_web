const form = document.querySelector('#signup-form');
const resultEl = document.querySelector('#result');
const submitBtn = form.querySelector('button[type="submit"]');
const viewListBtn = document.querySelector('#view-list-btn');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.password = payload.confirmPassword = 'demoPass88';
  payload.interests = ['後端入門'];
  payload.terms = true;

  try {
    resultEl.textContent = '送出中...';
    const res = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || '失敗');
    }

    resultEl.textContent = `報名成功！\nID: ${data.participant.id}`;
    form.reset(); 
    } catch (error) {
    resultEl.textContent = `錯誤：${error.message}`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
  }
});
viewListBtn.addEventListener('click', async () => {
  try {
    viewListBtn.disabled = true;
    const res = await fetch('http://localhost:3001/api/signup');
    const data = await res.json();

    resultEl.textContent = JSON.stringify(data, null, 2);
    form.reset();
  } catch (error) {
    resultEl.textContent = `錯誤：${error.message}`;
  }finally {
    viewListBtn.disabled = false;
    viewListBtn.textContent = '查看目前報名清單';
  }
});
