const MeiliSearch = require("meilisearch");

const client = new MeiliSearch({
  host: "https://search.f6sny.com/",
  apiKey: "bca2c63b74b297238d9d0c0f92eafc3271b7fef25c9ff64429976c83dcb4"
  //apiKey: process.env.MEILI_API_KEY
});

const index = client.getIndex("jokes");

module.exports = {
  get(offset, limit, query) {
    if (query) {
      return index.search(query, { offset, limit });
    } else {
      return index.getDocuments({ offset, limit });
    }
  }
};