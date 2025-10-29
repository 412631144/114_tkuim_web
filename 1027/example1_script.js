// example1_script.js
// 統一在父層監聽點擊與送出事件，處理清單項目新增/刪除

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) {
    return;
  }
  const item = document.createElement('li');
  item.className = 'list-group-item d-flex justify-content-between align-items-center';
  item.innerHTML = `${value} <button class="btn btn-sm btn-outline-success me-2" data-action="complete">完成</button> <button class="btn btn-sm btn-outline-danger" data-action="remove">刪除</button>`;
  list.appendChild(item);
  input.value = '';
  input.focus();
});

list.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action="remove"]');
  const action = target.dataset.action;
  if (!target) {
    return;
  }
  const item = target.closest('li');


  if (action === 'remove') {
    item.remove();
  } else if (action === 'complete') {
    item.classList.toggle('list-group-item-success'); 
  }
});



