// Ubah bagian ini sesuai data event Rumercy kamu.
// Setiap jawaban boleh memiliki beberapa variasi penulisan.
const QUIZ_CONFIG = {
  answers: {
    answerOne: ["1 januari 2024", "01 januari 2024", "01/01/2024", "1/1/2024"],
    answerTwo: ["5", "lima"],
    answerThree: ["Fraggment"]
  },
  giftUrl: "https://example.com/hadiah-rumercy"
};

const form = document.querySelector("#puzzleForm");
const steps = [...document.querySelectorAll(".step")];
const reward = document.querySelector("#reward");
const giftLink = document.querySelector("#giftLink");
const copyButton = document.querySelector("#copyButton");
const copyNotice = document.querySelector("#copyNotice");

giftLink.href = QUIZ_CONFIG.giftUrl;
giftLink.textContent = QUIZ_CONFIG.giftUrl;

function showStep(stepNumber) {
  steps.forEach((step) => step.classList.toggle("active", Number(step.dataset.step) === stepNumber));
}

function setError(stepNumber, message = "") {
  document.querySelector(`[data-step="${stepNumber}"] .error-message`).textContent = message;
}

function normalize(value) {
  return value.toLowerCase().trim().replace(/\s+/g, " ").replace(/[.,]/g, "");
}

document.querySelector("[data-next]").addEventListener("click", () => {
  const name = form.elements.name.value.trim();
  const group = form.elements.group.value.trim();

  if (!name || !group) {
    setError(1, "Isi nama dan kelompokmu dulu ya ♡");
    return;
  }
  setError(1);
  showStep(2);
  form.elements.answerOne.focus();
});

document.querySelector("[data-back]").addEventListener("click", () => showStep(1));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const allFilled = ["answerOne", "answerTwo", "answerThree"].every((name) => form.elements[name].value.trim());
  if (!allFilled) {
    setError(2, "Jangan ada yang terlewat, ya!");
    return;
  }

  const correct = Object.entries(QUIZ_CONFIG.answers).every(([name, validAnswers]) =>
    validAnswers.map(normalize).includes(normalize(form.elements[name].value))
  );

  if (!correct) {
    setError(2, "Ada jawaban yang belum tepat. Coba cek lagi, bestie! ✦");
    return;
  }

  form.hidden = true;
  reward.hidden = false;
  document.querySelector("#winnerName").textContent = form.elements.name.value.trim();
  reward.scrollIntoView({ behavior: "smooth", block: "center" });
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(QUIZ_CONFIG.giftUrl);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = QUIZ_CONFIG.giftUrl;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  copyNotice.textContent = "Link berhasil disalin ✦";
  copyButton.textContent = "Tersalin!";
  setTimeout(() => { copyButton.textContent = "Salin link"; }, 1800);
});

document.querySelector("#restartButton").addEventListener("click", () => {
  form.reset();
  reward.hidden = true;
  form.hidden = false;
  setError(1);
  setError(2);
  copyNotice.textContent = "";
  showStep(1);
  form.elements.name.focus();
});