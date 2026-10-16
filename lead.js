// api/lead.js — Vercel Serverless Function (скрывает BOT_TOKEN от браузера)
// Положи этот файл в папку /api при деплое на Vercel
// В Vercel → Settings → Environment Variables добавь: BOT_TOKEN и CHAT_ID

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const BOT_TOKEN = process.env.BOT_TOKEN; // 8759403736:AAHjfE96uu0bJ_J6f4UKPggM5UNN84aTf_E
  const CHAT_ID = process.env.CHAT_ID; // например -1003302151570 или 484274948

  if (!BOT_TOKEN || !CHAT_ID) return res.status(500).json({ ok: false, error: 'BOT_TOKEN or CHAT_ID not set' });

  try {
    const { name, phone, product, wishes, contact, time, page } = req.body;
    if (!name || !phone) return res.status(400).json({ ok: false, error: 'name and phone required' });

    const text = `🔥 Новая заявка с сайта Demidov Furniture

👤 Имя: ${name}
📞 Телефон: ${phone}
🛋️ Что нужно: ${product}
💬 Пожелания: ${wishes}
📲 Связь: ${contact}
🕒 Время: ${time}
🌐 Страница: ${page}

#заявка`;

    const tg = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });
    const j = await tg.json();
    if (!j.ok) return res.status(500).json({ ok: false, error: j.description, raw: j });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
