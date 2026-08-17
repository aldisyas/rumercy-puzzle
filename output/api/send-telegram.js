export default async function handler(req, res) {
  // Hanya menerima POST dari website
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    // Ambil data dari website
    const { name, group, time } = req.body;

    // Ambil credential dari Vercel Environment Variables
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Cek apakah Environment Variables tersedia
    if (!token || !chatId) {
      console.error("Telegram Environment Variables tidak ditemukan.");

      return res.status(500).json({
        ok: false,
        error: "Telegram environment variables tidak ditemukan"
      });
    }

    // Buat pesan Telegram
    const message =
      `🎉 *Puzzle Selesai!*\n\n` +
      `👤 Nama: ${name}\n` +
      `📚 Kelompok: ${group}\n` +
      `🕒 Waktu: ${time}`;

    // Kirim pesan ke Telegram
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

    // Ambil response dari Telegram
    const result = await telegramResponse.json();

    // Tampilkan hasil di Vercel Logs
    console.log("Telegram response:", result);

    // Kirim hasil kembali ke website
    return res
      .status(telegramResponse.ok ? 200 : 400)
      .json(result);

  } catch (error) {
    console.error("Telegram error:", error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}