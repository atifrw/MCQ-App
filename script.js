let questionsData = {};

fetch("mcqs.json")
  .then((res) => res.json())
  .then((data) => {
    questionsData = data;
    const chapterSelect = document.getElementById("chapterSelect");
    Object.keys(data).forEach((chapter) => {
      const opt = document.createElement("option");
      opt.value = chapter;
      opt.textContent = chapter;
      chapterSelect.appendChild(opt);
    });
  });

function loadQuestions() {
  const chapter = document.getElementById("chapterSelect").value;
  const quizBox = document.getElementById("quizBox");
  quizBox.innerHTML = "";

  if (!chapter || !questionsData[chapter]) return;

  questionsData[chapter].forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `<b>Q${i + 1}: ${q.question}</b><br>`;
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => alert("सही उत्तर: " + q.answer);
      div.appendChild(btn);
      div.appendChild(document.createElement("br"));
    });
    quizBox.appendChild(div);
    quizBox.appendChild(document.createElement("hr"));
  });
}