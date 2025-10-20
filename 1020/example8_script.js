// example8_script.js
// 宣告一個學生物件，包含屬性與方法

var student = {
  name: '小明',
  id: 'A123456789',
  scores: [85, 90, 78],
  getAverage: function() {
    var sum = 0;
    for (var i = 0; i < this.scores.length; i++) {
      sum += this.scores[i];
    }
    return sum / this.scores.length;
  },
  info: function() {
    return '姓名：' + this.name + '\n學號：' + this.id;
  },
  getGrade: function() {
    var msg;
    switch (true) {
        case (this.getAverage() >= 80 && this.getAverage() <= 100):
            msg = 'A';
            break;
        case (this.getAverage() >= 60 && this.getAverage() <= 79):
            msg = 'B';
            break;
        case (this.getAverage() >= 40 && this.getAverage() <= 59):
            msg = 'C';
            break;
        case (this.getAverage() >= 20 && this.getAverage() <= 39):
            msg = 'D';
            break;
        case (this.getAverage() >= 0 && this.getAverage() <= 19):
            msg = 'E';
            break;
    }    
        return msg;
 }
};

var text = student.info() + '\n平均：' + student.getAverage().toFixed(2) + '\n平均分數對應等第 : ' + student.getGrade();
document.getElementById('result').textContent = text;
