

function toNumber(str) {
   var n = parseFloat(str);
   return isNaN(n) ? null : n;
}

function runTemperatureConverter() {
    let Temp = prompt(" 請輸入溫度：");
    let Unit = prompt(" 請輸入單位：");

    let temp = toNumber(Temp);
    let resultText = "";

    if (temp === null) {
        resultText = "錯誤：您輸入的溫度不是一個有效的數字。";
    } else if (Unit === null || Unit.trim() === "") {
        resultText = "錯誤：您沒有輸入單位 (C 或 F)。";
    } else {
        let unit = Unit.trim().toUpperCase();

        if (unit === 'C') {
            let fahrenheit = (temp * 9 / 5) + 32;
            resultText = `${temp}°C 轉換為 ${fahrenheit.toFixed(2)}°F`;
        } else if (unit === 'F') {
            let celsius = (temp - 32) * 5 / 9;
            resultText = `${temp}°F 轉換為 ${celsius.toFixed(2)}°C`;
        } else {
            resultText = "錯誤：單位無效，請輸入 C 或 F。";
        }
    }
    alert("【溫度轉換器】\n" + resultText);
    document.getElementById("temperatureResult").textContent = resultText;
}


function runGuessingGame() {
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    
    let guessCount = 0;
    let guessedCorrectly = false;
    let userGuess;
    
    alert("我已經想好一個 1 到 100 之間的數字。");

    while (!guessedCorrectly) {
        let input = prompt("猜一個 1 到 100 之間的數字：");

        if (input === null) {
            alert("您已取消遊戲。");
            document.getElementById("guessingGameResult").textContent = "遊戲已取消。";
            return; 
        }

        userGuess = parseInt(input, 10);
        guessCount++;

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            alert("輸入無效！請輸入 1 到 100 之間的數字。");
        } else if (userGuess < targetNumber) {
            alert("再大一點！");
        } else if (userGuess > targetNumber) {
            alert("再小一點！");
        } else {
            guessedCorrectly = true;
            let resultText = `恭喜猜中！答案就是 ${targetNumber}！\n您總共猜了 ${guessCount} 次。`;
            
            alert("【猜數字遊戲】\n" + resultText);
            document.getElementById("guessingGameResult").textContent = resultText;
        }
    }
}


runTemperatureConverter();

runGuessingGame();