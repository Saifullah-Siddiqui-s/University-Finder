export default async function handler(req, res) {
  const { name = "", country = "" } = req.query;
  const url = `http://universities.hipolabs.com/search?name=${encodeURIComponent(
    name
  )}&country=${encodeURIComponent(country)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch API" });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy fetch failed", details: err.message });
  }
}
