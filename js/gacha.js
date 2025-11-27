let completedTasks = parseInt(localStorage.getItem("completedTaskCounter"), 10) || 0;
let drawnImages = JSON.parse(localStorage.getItem("drawnImages")) || [];
let currentDrawResult = null;
const drawButton = document.getElementById("draw-button");

const animationFrames = [
    'images/ani1.png',
    'images/ani2.png',
    'images/ani3.png',
    'images/ani4.png'
];

const gradeProbabilities = {
    S: 0.01,
    A: 0.1,
    B: 0.34,
    C: 0.55
};

document.addEventListener("DOMContentLoaded", () => {
    updateCurrencyDisplay();
    draw();
});

// 현재 화면 업데이트
function updateCurrencyDisplay() {    
    const currencyElement = document.getElementById("currency");
    completedTasks = parseInt(localStorage.getItem("completedTaskCounter"), 10) || 0;
    currencyElement.textContent = completedTasks;

    if (completedTasks > 0) {
        drawButton.disabled = false;
        drawButton.classList.add("active-sparkle");
    } else {
        drawButton.disabled = true;
        drawButton.classList.remove("active-sparkle");
    }
}

// 뽑기 버튼 클릭
function draw() {
    drawButton.addEventListener("click", () => {
        if (drawButton.textContent === "뽑기") {
            if (completedTasks <= 0) {
                alert("재화가 부족합니다.");
                return;
            }

            completedTasks -= 1;
            localStorage.setItem("completedTaskCounter", completedTasks);
            updateCurrencyDisplay();

            clearPreviousResult();
            startAnimation();
        } else if (drawButton.textContent === ">>> 눌러! <<<") {
            displayResult(currentDrawResult);
            drawButton.textContent = "뽑기";
        }
    });
}

// 대기 애니메이션 출력
function startAnimation() {
    drawButton.classList.remove("active-sparkle");
    let frameIndex = 0;
    const animationImage = document.getElementById("animation-image");
    document.getElementById("animation-container").style.display = 'block';

    drawButton.disabled = true;

    const animationInterval = setInterval(() => {
        animationImage.src = animationFrames[frameIndex];
        frameIndex = (frameIndex + 1) % animationFrames.length;
    }, 500);

    setTimeout(() => {
        clearInterval(animationInterval);
        document.getElementById("animation-container").style.display = 'none';

        drawButton.disabled = false;
        drawButton.textContent = ">>> 눌러! <<<"; 

        drawButton.classList.add("active-sparkle");
        currentDrawResult = getDrawResult();
    }, 3000);
}

// 결과 만들기
function getDrawResult() {
    const randomValue = Math.random();
    let totalProbability = 0;

    for (let grade in gradeProbabilities) {
        totalProbability += gradeProbabilities[grade];
        if (randomValue < totalProbability) {
            const gradeImages = images.filter(image => image.grade === grade);
            return getRandomImage(gradeImages);
        }
    }

    return getRandomImage(images.filter(image => image.grade === "C"));
}

// 결과 출력
function displayResult(result) {
    const resultText = document.getElementById("resultText");
    const resultImage = document.getElementById("resultImage");

    if (drawnImages.some(image => image.src === result.src)) {
        resultText.textContent = `이미 획득한 사진: ${result.name}`;
        resultImage.classList.add("duplicate");
    } else {
        drawnImages.push(result);
        localStorage.setItem("drawnImages", JSON.stringify(drawnImages));
        resultText.textContent = `${result.grade} 등급: ${result.name}`;
    }

    resultImage.src = result.src;
    if (result.grade === "S") {
        setTimeout(() => {
            resultImage.className = "s-special";
        }, 1000);
    }
    resultImage.className = "fade-in";

    document.getElementById("result").style.display = "block";
}

// 랜덤 이미지 가져오기
function getRandomImage(images) {
    return images[Math.floor(Math.random() * images.length)];
}

// 이전 결과 지우기
function clearPreviousResult() {
    const resultText = document.getElementById("resultText");
    const resultImage = document.getElementById("resultImage");

    if (resultText) resultText.textContent = "";
    if (resultImage) {
        resultImage.src = "";
        resultImage.className = "";
    }

    document.getElementById("result").style.display = "none";
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const images = [
    { name: "깜찍후추", grade: "S", src: "images/S깜찍후추.jpg" },
    { name: "너무귀여운데후추", grade: "S", src: "images/S너무귀여운데후추.jpg" },
    { name: "너무귀여워후추", grade: "S", src: "images/S너무귀여워후추.jpg" },
    { name: "너무선명해요후추", grade: "S", src: "images/S너무선명해요후추.jpg" },
    { name: "노란곰돌이후추", grade: "S", src: "images/S노란곰돌이후추.jpg" },
    { name: "미용후추", grade: "S", src: "images/S미용후추.jpg" },
    { name: "벚꽃설", grade: "S", src: "images/S벚꽃설.jpg" },
    { name: "벚꽃후추", grade: "S", src: "images/S벚꽃후추.jpg" },
    { name: "한복후추", grade: "S", src: "images/S한복후추.jpg" },
    { name: "할짝후추", grade: "S", src: "images/S할짝후추.jpg" },
    { name: "해맑아요후추",grade: "S", src: "images/S해맑아요후추.jpg" },
    { name: "혀내민후추", grade: "S", src: "images/S혀내민후추.jpg" },

    { name: "갸웃후추", grade: "A", src: "images/A갸웃후추.jpg" },
    { name: "귀여워후추", grade: "A", src: "images/A귀여워후추.jpg" },
    { name: "그물망후추", grade: "A", src: "images/A그물망후추.jpg" },
    { name: "깜찍정면후추", grade: "A", src: "images/A깜찍정면후추.jpg" },
    { name: "너무선명해요후추", grade: "A", src: "images/A너무선명해요후추.jpg" },
    { name: "단아후추", grade: "A", src: "images/A단아후추.jpg" },
    { name: "동그래요후추", grade: "A", src: "images/A동그래요후추.jpg" },
    { name: "뒤돌아후추", grade: "A", src: "images/A뒤돌아후추.jpg" },
    { name: "뒷다리후추", grade: "A", src: "images/A뒷다리후추.jpg" },
    { name: "무지개후추", grade: "A", src: "images/A무지개후추.jpg" },
    { name: "미용설", grade: "A", src: "images/A미용설.jpg" },
    { name: "사이드미러후추", grade: "A", src: "images/A사이드미러후추.jpg" },
    { name: "산책좋아후추", grade: "A", src: "images/A산책좋아후추.jpg" },
    { name: "삼각김밥후추", grade: "A", src: "images/A삼각김밥후추.jpg" },
    { name: "소파후추", grade: "A", src: "images/A소파후추.jpg" },
    { name: "엉덩이후추", grade: "A", src: "images/A엉덩이후추.jpg" },
    { name: "오골계후추", grade: "A", src: "images/A오골계후추.jpg" },
    { name: "요가후추", grade: "A", src: "images/A요가후추.jpg" },
    { name: "정수리후추", grade: "A", src: "images/A정수리후추.jpg" },
    { name: "햇빛베란다후추", grade: "A", src: "images/A햇빛베란다후추.jpg" },
    { name: "햇빛후추", grade: "A", src: "images/A햇빛후추.jpg" },
    { name: "후추발", grade: "A", src: "images/A후추발.jpg" },

    { name: "강쥐셋", grade: "B", src: "images/B강쥐셋.jpg" },
    { name: "기저귀후추", grade: "B", src: "images/B기저귀후추.jpg" },
    { name: "기저귀후추2", grade: "B", src: "images/B기저귀후추2.jpg" },
    { name: "기저귀후추3", grade: "B", src: "images/B기저귀후추3.jpg" },
    { name: "나른후추", grade: "B", src: "images/B나른후추.jpg" },
    { name: "눈부셔후추", grade: "B", src: "images/B눈부셔후추.jpg" },
    { name: "눈치보여설", grade: "B", src: "images/B눈치보여설.jpg" },
    { name: "뒷통수후추", grade: "B", src: "images/B뒷통수후추.jpg" },
    { name: "말랑후추", grade: "B", src: "images/B말랑후추.jpg" },
    { name: "머리콕후추", grade: "B", src: "images/B머리콕후추.jpg" },
    { name: "발후추", grade: "B", src: "images/B발후추.jpg" },
    { name: "배깐후추", grade: "B", src: "images/B배깐후추.jpg" },
    { name: "베개설", grade: "B", src: "images/B베개설.jpg" },
    { name: "불쌍후추", grade: "B", src: "images/B불쌍후추.jpg" },
    { name: "인형후추", grade: "B", src: "images/B인형후추.jpg" },
    { name: "잔디설", grade: "B", src: "images/B잔디설.jpg" },
    { name: "전신눕방후추", grade: "B", src: "images/B전신눕방후추.jpg" },
    { name: "전신후추", grade: "B", src: "images/B전신후추.jpg" },
    { name: "정면후추", grade: "B", src: "images/B정면후추.jpg" },
    { name: "졸려설", grade: "B", src: "images/B졸려설.jpg" },
    { name: "책상눕방후추에요", grade: "B", src: "images/B책상눕방후추에요.jpg" },
    { name: "책상아래후추", grade: "B", src: "images/B책상아래후추.jpg" },
    { name: "체리후추", grade: "B", src: "images/B체리후추.jpg" },
    { name: "테트리스후추", grade: "B", src: "images/B테트리스후추.jpg" },
    { name: "티비후추", grade: "B", src: "images/B티비후추.jpg" },
    { name: "피곤한가설", grade: "B", src: "images/B피곤한가설.jpg" },
    { name: "하얀기저귀후추", grade: "B", src: "images/B하얀기저귀후추.jpg" },
    { name: "혀할짝후추", grade: "B", src: "images/B혀할짝후추.jpg" },
    { name: "후추설", grade: "B", src: "images/B후추설.jpg" },
    
    { name: "근접설", grade: "C", src: "images/C근접설.jpg" },
    { name: "기다란후추", grade: "C", src: "images/C기다란후추.jpg" },
    { name: "기린후추", grade: "C", src: "images/C기린후추.jpg" },
    { name: "기본후추", grade: "C", src: "images/Cdefault.jpg" },
    { name: "기본후추2", grade: "C", src: "images/Cdefault2.jpg" },
    { name: "기본후추3", grade: "C", src: "images/Cdefault3.jpg" },
    { name: "까만후추", grade: "C", src: "images/C까만후추.jpg" },
    { name: "까만후추뒤돌아", grade: "C", src: "images/C까만후추뒤돌아.jpg" },
    { name: "납작근접후추", grade: "C", src: "images/C납작근접후추.jpg" },
    { name: "내복후추", grade: "C", src: "images/C내복후추.jpg" },
    { name: "눈빨강후추", grade: "C", src: "images/C눈빨강후추.jpg" },
    { name: "눈치설", grade: "C", src: "images/C눈치설.jpg" },
    { name: "눈치설2", grade: "C", src: "images/C눈치설2.jpg" },
    { name: "눈치설3", grade: "C", src: "images/C눈치설3.jpg" },
    { name: "눈치설4", grade: "C", src: "images/C눈치설4.jpg" },
    { name: "눕방설", grade: "C", src: "images/C눕방설.jpg" },
    { name: "눕방오골계후추", grade: "C", src: "images/C눕방오골계후추.jpg" },
    { name: "눕방후추", grade: "C", src: "images/C눕방후추.jpg" },
    { name: "도망후추설", grade: "C", src: "images/C도망후추설.jpg" },
    { name: "말똥후추", grade: "C", src: "images/C말똥후추.jpg" },
    { name: "머리동그라미후추", grade: "C", src: "images/C머리동그라미후추.jpg" },
    { name: "미용설", grade: "C", src: "images/C미용설.jpg" },
    { name: "미용후추", grade: "C", src: "images/C미용후추.jpg" },
    { name: "미용후추2", grade: "C", src: "images/C미용후추2.jpg" },
    { name: "바닥눕방설", grade: "C", src: "images/C바닥눕방설.jpg" },
    { name: "바닥설", grade: "C", src: "images/C바닥설.jpg" },
    { name: "바람후추", grade: "C", src: "images/C바람후추.jpg" },
    { name: "바보설", grade: "C", src: "images/C바보설.jpg" },
    { name: "배깐설", grade: "C", src: "images/C배깐설.jpg" },
    { name: "뱀파이어후추", grade: "C", src: "images/C뱀파이어후추.jpg" },
    { name: "뱀파이어후추2", grade: "C", src: "images/C뱀파이어후추2.jpg" },
    { name: "복실후추", grade: "C", src: "images/C복실후추.jpg" },
    { name: "불쌍미용후추", grade: "C", src: "images/C불쌍미용후추.jpg" },
    { name: "설근접", grade: "C", src: "images/C설근접.jpg" },
    { name: "소파후추", grade: "C", src: "images/C소파후추.jpg" },
    { name: "솜사탕후추", grade: "C", src: "images/C솜사탕후추.jpg" },
    { name: "송곳니설", grade: "C", src: "images/C송곳니설.jpg" },
    { name: "신나후추", grade: "C", src: "images/C신나후추.jpg" },
    { name: "신나후추2", grade: "C", src: "images/신나후추2.jpg" },
    { name: "안보여후추", grade: "C", src: "images/C안보여후추.jpg" },
    { name: "엉덩설", grade: "C", src: "images/C엉덩설.jpg" },
    { name: "역광후추", grade: "C", src: "images/C역광후추.jpg" },
    { name: "역광후추2", grade: "C", src: "images/C역광후추2.jpg" },
    { name: "의자눕방후추", grade: "C", src: "images/C의자눕방후추.jpg" },
    { name: "자는설", grade: "C", src: "images/C자는설.jpg" },
    { name: "졸려후추", grade: "C", src: "images/C졸려후추.jpg" },
    { name: "졸려후추2", grade: "C", src: "images/C졸려후추2.jpg" },
    { name: "째려봐요후추", grade: "C", src: "images/C째려봐요후추.jpg" },
    { name: "쭈구리후추", grade: "C", src: "images/C쭈구리후추.jpg" },
    { name: "쭈구리후추2", grade: "C", src: "images/C쭈구리후추2.jpg" },
    { name: "책상눕방후추", grade: "C", src: "images/C책상눕방후추.jpg" },
    { name: "초근접설", grade: "C", src: "images/C초근접설.jpg" },
    { name: "초록소파후추", grade: "C", src: "images/C초록소파후추.jpg" },
    { name: "케르베로스후추", grade: "C", src: "images/C케르베로스후추.jpg" },
    { name: "파란미용후추", grade: "C", src: "images/C파란미용후추.jpg" },
    { name: "파란미용후추2", grade: "C", src: "images/C파란미용후추2.jpg" },
    { name: "화질구지후추", grade: "C", src: "images/C화질구지후추.jpg" },
    { name: "후추근접", grade: "C", src: "images/C후추근접.jpg" },
    { name: "후추머리", grade: "C", src: "images/C후추머리.jpg" },
    { name: "후추설", grade: "C", src: "images/C후추설.jpg" },
    { name: "흔들후추", grade: "C", src: "images/C흔들후추.jpg" },
    { name: "흔들후추설", grade: "C", src: "images/C흔들후추설.jpg" },
    { name: "흔들후추설2", grade: "C", src: "images/C흔들후추설2.jpg" }
];