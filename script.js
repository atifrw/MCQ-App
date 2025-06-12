let data = {};
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let wrongQuestions = [];

fetch("mcqs.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    const chapterSelect = document.getElementById("chapterSelect");
    chapterSelect.innerHTML += "<option value='__all__'>рд╕рднреА рдЕрдзреНрдпрд╛рдп</option>";
    Object.keys(data).forEach(ch => {
      const opt = document.createElement("option");
      opt.value = ch;
      opt.textContent = ch;
      chapterSelect.appendChild(opt);
    });
  });

function startQuiz() {
  const chapter = document.getElementById("chapterSelect").value;
  currentQuestions = [];
  correctCount = 0;
  incorrectCount = 0;
  wrongQuestions = [];

  if (chapter === "__all__") {
    Object.values(data).forEach(arr => currentQuestions.push(...arr));
  } else if (data[chapter]) {
    currentQuestions = [...data[chapter]];
  }

  shuffle(currentQuestions);
  currentIndex = 0;
  document.getElementById("quizArea").style.display = "block";
  showQuestion();
}

function showQuestion() {
  const q = currentQuestions[currentIndex];
  document.getElementById("questionBox").innerHTML = `<b>Q${currentIndex + 1}:</b> ${q.question}`;
  const box = document.getElementById("optionsBox");
  box.innerHTML = "";
  document.getElementById("resultBox").innerText = "";
  document.getElementById("nextBtn").style.display = "none";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt, q.answer, btn);
    box.appendChild(btn);
  });
}

function handleAnswer(selected, correct, btn) {
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(b => b.disabled = true);

  if (selected === correct) {
    btn.classList.add("correct");
    document.getElementById("resultBox").innerText = "тЬЕ рд╕рд╣реА рдЙрддреНрддрд░!";
    correctCount++;
  } else {
    btn.classList.add("incorrect");
    document.getElementById("resultBox").innerText = `тЭМ рдЧрд▓рдд! рд╕рд╣реА рдЙрддреНрддрд░: ${correct}`;
    incorrectCount++;
    wrongQuestions.push(currentQuestions[currentIndex]);
  }

  document.getElementById("nextBtn").style.display = "block";
}

function showNext() {
  currentIndex++;
  if (currentIndex < currentQuestions.length) {
    showQuestion();
  } else {
    showFinalScore();
  }
}

function showFinalScore() {
  const total = correctCount + incorrectCount;
  document.getElementById("questionBox").innerHTML = `ЁЯОЙ Quiz рдЦрддреНрдо!\n\n рдХреБрд▓ рдкреНрд░рд╢реНрди: ${total}\nтЬЕ рд╕рд╣реА: ${correctCount}\nтЭМ рдЧрд▓рдд: ${incorrectCount}`;
  document.getElementById("optionsBox").innerHTML = "";
  document.getElementById("resultBox").innerText = "";
  document.getElementById("nextBtn").style.display = "none";

  if (wrongQuestions.length > 0) {
    const retryBtn = document.createElement("button");
    retryBtn.className = "option-btn";
    retryBtn.textContent = "ЁЯФБ рдЧрд▓рдд рд╕рд╡рд╛рд▓ рдлрд┐рд░ рд╕реЗ рдХрд░реЗрдВ";
    retryBtn.onclick = () => {
      currentQuestions = [...wrongQuestions];
      currentIndex = 0;
      correctCount = 0;
      incorrectCount = 0;
      wrongQuestions = [];
      showQuestion();
    };
    document.getElementById("optionsBox").appendChild(retryBtn);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
