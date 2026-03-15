import axios from "axios";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

export default async function chart(req, res) {
  try {
  const bbox = req.query.bbox;
  const inputType = req.query.type;

  const url = `http://5.181.253.35:3000/api/click?type=${inputType}&bbox=${bbox}`
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
    res.json('error');
  }

}
