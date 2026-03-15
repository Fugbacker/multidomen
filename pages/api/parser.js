// pages/api/parse.js
import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
  try {
    // === НАСТРОЙКИ (можно менять прямо здесь) ===
    const CATEGORY = req.query.category || "news"; // категория (например news, crypto)
    const START_PAGE = parseInt(req.query.page || "1", 10); // стартовая страница
    const END_PAGE = req.query.end ? parseInt(req.query.end, 10) : null; // конечная (если null, идём до last_page)
    // ============================================

    // Подключаемся к MongoDB
    const client = await new MongoClient(process.env.MONGO_URL).connect();
    const db = client.db("parserDB");
    const collection = db.collection("channels");

    let currentPage = START_PAGE;
    let lastPage = END_PAGE || START_PAGE;

    while (true) {
      console.log(`🔄 Загружаю страницу ${currentPage}...`);

      const response = await fetch(
        `https://tlgrm.ru/channels/${CATEGORY}?page=${currentPage}`,
        {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        }
      );

      if (!response.ok) {
        console.error(`❌ Ошибка запроса: ${response.status}`);
        break;
      }

      const data = await response.json();

      // Узнаём последнюю страницу, если не задана вручную
      if (!END_PAGE) {
        lastPage = data.last_page;
      }

      console.log(
        `✅ Получено ${data.data.length} каналов (страница ${currentPage}/${lastPage})`
      );

      // Оставляем только нужные поля
      const docs = data.data.map((ch) => ({
        peer_id: ch.peer_id,
        name: ch.name,
        link: ch.link,
        description: ch.description,
        subscribers: ch.subscribers,
        official: ch.official,
        category: CATEGORY,
        parsedAt: new Date(),
      }));

      // Сохраняем в MongoDB (upsert по peer_id)
      for (const doc of docs) {
        await collection.updateOne(
          { peer_id: doc.peer_id },
          { $set: doc },
          { upsert: true }
        );
      }

      console.log(`💾 Сохранено ${docs.length} каналов`);

      if (currentPage >= lastPage) {
        console.log("🎉 Парсинг завершён!");
        break;
      }

      currentPage++;
    }

    await client.close();

    res.status(200).json({ success: true, message: "Парсинг завершён" });
  } catch (error) {
    console.error("Ошибка:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
