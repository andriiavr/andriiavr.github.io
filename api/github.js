import axios from "axios";

export default async function getReposHandler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://andriiavr.github.io");

  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { sort, direction, per_page } = req.query;

  try {
    const response = await axios.get(
      "https://api.github.com/users/andriiavr/repos",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "andriiavr",
        },
        params: {
            sort,
            direction,
            per_page
        }
      },
    );
    const { data } = response;

    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch Github repositories",
    });
  }
}
