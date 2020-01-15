
const tunebatScraper = require('./tunebat-scraper');

tunebatScraper.search('jon bellion crop circles').then(tunebatScraper.analyze).catch(console.error).then(console.log);
