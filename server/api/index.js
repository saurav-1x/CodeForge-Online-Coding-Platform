const handler = require("../vercel-handler");

module.exports = (req, res) => {
  const rewrittenPath = req.query && req.query.path;

  if (typeof rewrittenPath === "string") {
    const requestUrl = new URL(req.url, "http://localhost");
    requestUrl.searchParams.delete("path");

    const query = requestUrl.searchParams.toString();
    req.url = rewrittenPath
      ? `/api/${rewrittenPath}${query ? `?${query}` : ""}`
      : "/";
  }

  return handler(req, res);
};
