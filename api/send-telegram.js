export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const { name, group, time } = req.body;

    if (!name || !group || !time) {
      return res.status(400).json({
        ok: false,
        error: "Data tidak lengkap"
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message =
      `🎉 *Puzzle Selesai!*\n\n` +
      `👤 Nama: ${name}\n` +
      `📚 Kelompok: ${group}\n` +
      `🕒 Waktu: ${time}`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown"
        })
      }
    );

    const result = await telegramResponse.json();

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error"
    });
  }
}