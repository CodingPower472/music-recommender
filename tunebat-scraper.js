
const axios = require('axios');
const cheerio = require('cheerio');

function parseAttributeValues(main, table) {
    let durationStr = main[2].split(':');
    let duration = parseInt(durationStr[0] * 60) + parseInt(durationStr[1]);
    var loudness = parseInt(table[3].split(' ')[0]);
    return {
        key: main[0],
        camelot: main[1],
        duration,
        bpm: parseInt(main[3]),
        energy: parseInt(table[0]),
        danceability: parseInt(table[1]),
        happiness: parseInt(table[2]),
        loudness,
        acousticness: parseInt(table[4]),
        instrumentalness: parseInt(table[5]),
        liveness: parseInt(table[6]),
        speechiness: parseInt(table[7])
    };
}

async function search(query) {
    let urlEncoded = encodeURIComponent(query);
    let searchUrl = `https://tunebat.com/Search?q=${urlEncoded}`;
    let htmlContents = (await axios.get(searchUrl)).data;
    let $ = cheerio.load(htmlContents);
    let firstResultElem = $('.searchResultNode')[0];
    let relativeLink = $(firstResultElem).find('a').attr('href');
    var link = `https://tunebat.com${relativeLink}`;
    return link;
}

async function analyze(link) {
    let htmlContents = (await axios.get(link)).data;
    let $ = cheerio.load(htmlContents);
    let artist = $('.main-artist-name').first().text().trim();
    let name = $('.main-track-name').first().text().trim();
    let mainAttributeValues = $('.main-attribute-value').map((_, elem) => $(elem).text()).get();
    let attributeTbody = $('table.attribute-table > tbody');
    let attributeTrow = attributeTbody.find('tr')[1];
    let tableAttributeValues = $(attributeTrow).find('td.attribute-table-element').map((_, elem) => $(elem).text()).get();
    return {
        name,
        artist,
        ...parseAttributeValues(mainAttributeValues, tableAttributeValues),
    };
}

module.exports = {
    search,
    analyze
};
