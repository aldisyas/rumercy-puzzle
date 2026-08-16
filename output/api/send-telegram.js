export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Method not allowed"
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {
    const body = await req.json();

    const { name, group, time } = body;

    if (!name || !group || !time) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Data tidak lengkap"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Environment variable Telegram belum tersedia.");

      return new Response(
        JSON.stringify({
          ok: false,
          error: "Telegram configuration missing"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

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

    console.log("Telegram:", result);

    return new Response(JSON.stringify(result), {
      status: telegramResponse.ok ? 200 : 400,
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error("Server error:", error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}