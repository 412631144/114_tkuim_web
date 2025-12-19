const API = 'http://localhost:3002/api';

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.error);
    return;
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  showUser();
  loadParticipants();
}

function showUser() {
  const user = JSON.parse(localStorage.getItem('user'));
  const div = document.getElementById('userInfo');

  if (!user) {
    div.innerText = '尚未登入';
    return;
  }

  div.innerText = `Email：${user.email}｜角色：${user.role}`;
}

async function createParticipant() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('請先登入');
    return;
  }

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;

  const res = await fetch(`${API}/participants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, phone })
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.error);
    return;
  }

  loadParticipants();
}
async function loadParticipants() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const res = await fetch(`${API}/participants`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const list = await res.json();
  const ul = document.getElementById('list');
  ul.innerHTML = '';

  list.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${p.name} (${p.phone})
      <button onclick="deleteParticipant('${p._id}')">刪除</button>
    `;
    ul.appendChild(li);
  });
}
async function deleteParticipant(id) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}/participants/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const data = await res.json();
    alert(data.error);
    return;
  }

  loadParticipants();
}
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.getElementById('userInfo').innerText = '尚未登入';
  document.getElementById('list').innerHTML = '';
}
showUser();
loadParticipants();