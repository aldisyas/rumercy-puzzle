export default async function handler(req) {
  return new Response(
    JSON.stringify({
      ok: true,
      message: "API Rumercy aktif!"
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}