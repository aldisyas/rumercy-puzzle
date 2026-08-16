// Ubah bagian ini sesuai data event Rumercy kamu.
// Setiap jawaban boleh memiliki beberapa variasi penulisan.
const QUIZ_CONFIG = {
  answers: {
    answerOne: ["pasensyana"],
    answerTwo: ["hnrrumercybot", "lima"],
    answerThree: ["Minggu", "minggu"],
    answerFour: ["Moocy", "moocy"],
    answerFive: ["6", "enam", "Enam"]
  },
  rewardBinary: "01010100 01100101 01101011 01110011 00100000 01100001 01100100 01101101 01101001 01101110 00100000 01000000 01110000 01010011 01110100 01110010 01100001 01110111 01100010 01100101 01110010 01110010 01111001"
};

// ====== KONFIGURASI TELEGRAM ======
const TELEGRAM_BOT_TOKEN = "8758374498:AAEjhAUnO90VskyhKYgGkdPqC5BSXcmQpJ0";
const TELEGRAM_CHAT_ID = "-1004331124456";
// ==================================

const form = document.querySelector("#puzzleForm");
const steps = [...document.querySelectorAll(".step")];
const reward = document.querySelector("#reward");
const rewardText = document.querySelector("#rewardText");
const copyButton = document.querySelector("#copyButton");
const copyNotice = document.querySelector("#copyNotice");

rewardText.textContent = QUIZ_CONFIG.rewardBinary;

function showStep(stepNumber) {
  steps.forEach((step) => step.classList.toggle("active", Number(step.dataset.step) === stepNumber));
}

function setError(stepNumber, message = "") {
  document.querySelector(`[data-step="${stepNumber}"] .error-message`).textContent = message;
}

function normalize(value) {
  return value.toLowerCase().trim().replace(/\s+/g, " ").replace(/[.,]/g, "");
}

async function sendTelegramReport(name, group, time) {
  const message = `🎉 *Puzzle Selesai!*\n\n` +
    `👤 Nama: ${name}\n` +
    `📚 Kelompok: ${group}\n` +
    `🕒 Waktu: ${time}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown"
      })
    });
  } catch (error) {
    console.error("Gagal kirim ke Telegram:", error);
  }
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
  const allFilled = ["answerOne", "answerTwo", "answerThree", "answerFour", "answerFive"].every((name) => form.elements[name].value.trim());
  if (!allFilled) {
    setError(2, "Jangan ada yang terlewat, ya!");
    return;
  }

  const correct = Object.entries(QUIZ_CONFIG.answers).every(([name, validAnswers]) =>
    validAnswers.map(normalize).includes(normalize(form.elements[name].value))
  );

  if (!correct) {
    setError(2, "Ada jawaban yang belum tepat. Coba cek lagi, moocy! ✦");
    return;
  }

  form.hidden = true;
  reward.hidden = false;
  document.querySelector("#winnerName").textContent = form.elements.name.value.trim();
  reward.scrollIntoView({ behavior: "smooth", block: "center" });

  form.hidden = true;
  reward.hidden = false;
  document.querySelector("#winnerName").textContent = form.elements.name.value.trim();
  reward.scrollIntoView({ behavior: "smooth", block: "center" });

  // ====== KODE BARU: Kirim laporan ke Telegram ======
  const now = new Date();
  const timeString = now.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  sendTelegramReport(
    form.elements.name.value.trim(),
    form.elements.group.value.trim(),
    timeString
  );
  // ==================================================
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(QUIZ_CONFIG.rewardBinary);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = QUIZ_CONFIG.rewardBinary;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  copyNotice.textContent = "Biner berhasil disalin ✦";
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