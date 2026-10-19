export async function onRequestPost(context) {
  const BOT_TOKEN = context.env.BOT_TOKEN;
  const CHAT_ID = context.env.CHAT_ID;
  if (!BOT_TOKEN || !CHAT_ID) {
    return new Response(JSON.stringify({ ok: false, error: "BOT_TOKEN or CHAT_ID not set" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  try {
    const { name, phone, product, wishes, contact, time, page } = await context.request.json();
    if (!name || !phone) return new Response(JSON.stringify({ ok: false, error: "name and phone required" }), { status: 400 });
    const text = `🔥 Новая заявка с сайта Demidov Furniture

👤 Имя: ${name}
📞 Телефон: ${phone}
🛋️ Что нужно: ${product}
💬 Пожелания: ${wishes}
📲 Связь: ${contact}
🕒 Время: ${time}
🌐 Страница: ${page}

#заявка`;
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
    const j = await tgRes.json();
    if (!j.ok) return new Response(JSON.stringify({ ok: false, error: j.description, raw: j }), { status: 500 });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
}
