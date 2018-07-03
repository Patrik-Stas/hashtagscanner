const winston = require('winston');
const axios = require('axios');

class HashTagModel {
    constructor(name, count, scantime) {
        this.name = name;
        this.count = count;
        this.scantime = scantime;
    }
};

exports.scanPrefix = async (cookie, prefix) => {
    let hashtags = [];
    try {
        console.log("Sending request to instagram");
        let result = await axios.get(`https://www.instagram.com/web/search/topsearch/?query=%23${prefix}`,
            {
                'cookie': cookie,
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,cs;q=0.7',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
                'accept': '*/*',
                'referer': 'https://www.instagram.com/explore/tags/prague/',
                'authority': 'www.instagram.com',
                'x-requested-with': 'XMLHttpRequest'
            });
        console.debug("Received result from instagram");
        console.debug(JSON.stringify(result.data));

        // let's assume here that anything found will be considered as not yet scanned
        // therefore rescanning prefix "hello" will consequently rescan the whole prefix subtree

        result.data.hashtags.forEach((tagobj) => {
            let hashtag = new HashTagModel(
                tagobj.hashtag.name,
                tagobj.hashtag.media_count,
                new Date().toISOString()
            );
            hashtags.push(hashtag);
        })
    } catch (error) {
        console.error(error)
    }
    return hashtags;
};