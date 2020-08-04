function buildPermaSlug(link, apiUrl) {
  const updatedLink = link.replace("http://", "https://");
  return updatedLink.replace(apiUrl, "");
}

module.exports = { buildPermaSlug };
