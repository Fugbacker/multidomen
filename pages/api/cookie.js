const COOKIE = process.env.COOKIE;

export default async function handler(req, res) {
  res.status(200).json(COOKIE);
}