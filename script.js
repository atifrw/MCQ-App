let data = {};
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let wrongQuestions = [];

fetch("mcqs.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    const chapterSelect = document.getElementById("chapterSelect");
    chapterSelect.innerHTML += "<option value='__all__'>सभी अध्याय</option>";
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

  if (chapter === "__all__") {
    Object.values(data).forEach(arr => currentQuestions.push(...arr));
  } else if (data[chapter]) {
    currentQuestions = [...data[chapter]];
  }

  shuffle(currentQuestions);
  currentIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  wrongQuestions = [];
  document.getElementById("quizArea").style.display = "block";
  document.getElementById("summaryBox").innerHTML = "";
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
    btn.onclick = () => {
      const isCorrect = opt === q.answer;
      btn.classList.add(isCorrect ? "correct" : "incorrect");
      if (!isCorrect) {
        wrongQuestions.push(q);
        wrongCount++;
        [...box.children].forEach(b => {
          if (b.textContent === q.answer) b.classList.add("correct");
        });
      } else {
        correctCount++;
      }
      disableButtons(box);
      document.getElementById("resultBox").innerText =
        isCorrect ? "✅ सही उत्तर!" : `❌ गलत! सही उत्तर: ${q.answer}`;
      document.getElementById("nextBtn").style.display = "block";
    };
    box.appendChild(btn);
  });
}

function disableButtons(box) {
  [...box.children].forEach(b => (b.disabled = true));
}

function showNext() {
  currentIndex++;
  if (currentIndex < currentQuestions.length) {
    showQuestion();
  } else {
    showSummary();
  }
}

function showSummary() {
  document.getElementById("quizArea").style.display = "none";
  let summary = `<h3>📊 Quiz Summary</h3>`;
  summary += `<p>✅ सही उत्तर: ${correctCount}</p>`;
  summary += `<p>❌ गलत उत्तर: ${wrongCount}</p>`;

  if (wrongQuestions.length > 0) {
    summary += `<button onclick="retryWrong()">🔁 गलत सवालों को फिर से हल करें</button>`;
  }

  document.getElementById("summaryBox").innerHTML = summary;
}

function retryWrong() {
  currentQuestions = [...wrongQuestions];
  currentIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  wrongQuestions = [];
  document.getElementById("quizArea").style.display = "block";
  document.getElementById("summaryBox").innerHTML = "";
  showQuestion();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
