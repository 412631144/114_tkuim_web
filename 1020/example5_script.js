// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

var output = '';
var first = prompt('請輸入1~9任意數(前數)')
var last = prompt('請輸入' + first +'~9的數(後數)')
for (var i = first; i <= last; i++) {
  for (var j = 1; j <= 9; j++) {
    output += i + 'x' + j + '=' + (i * j) + '\t';
  }
  output += '\n';
}
document.getElementById('result').textContent = output;
