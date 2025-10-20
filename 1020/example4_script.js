// example4_script.js
// 判斷輸入數字是否為奇數或偶數

var input = prompt('請輸入一個整數(0~100)：');
var n = parseInt(input, 10);
var msg = '';

if (isNaN(n)) {
  msg = '輸入不是有效的整數！';
} else if (n % 2 === 0) {
  msg = n + ' 是偶數';
} else {
  msg = n + ' 是奇數';
}

// 額外示範 switch（1、2、3 對應文字）
switch (true) {
  case (n >= 80 && n <= 100):
    msg += '\nA';
    break;
  case (n >= 60 && n <= 79):
    msg += '\nB';
    break;
  case (n >= 40 && n <= 59):
    msg += '\nC';
    break;
  case (n >= 20 && n <= 39):
    msg += '\nD';
    break;
  case (n >= 0 && n <= 19):
    msg += '\nE';
    break;    
  default:
    msg += '\n非 A/B/C/D/E';
}

document.getElementById('result').textContent = msg;
