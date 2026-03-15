import axios from "axios";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function chart(req, res) {
  try {
    const cadNum = req.query.cadNumber;
    const url = `http://5.181.253.35:3000/api/search?cadNumber=${cadNum}`;
    const resp = await axios.get(url, { timeout: 6000 });
    const data = resp?.data;

    if (
      data?.features?.length > 0 ||
      data?.feature ||
      data?.properties ||
      data?.data?.features?.length > 0 ||
      data?.[0]?.length > 0
    ) {
      return res.json(data);   // ✅ правильный ответ
    }

    return res.json([]);
  } catch (e) {
    console.log("chart api error:", e.message);
    return res.json([]);
  }
}
