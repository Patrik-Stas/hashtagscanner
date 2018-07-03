const model = require('./model');

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
        winston.debug("Received result from instagram");
        winston.debug(JSON.stringify(result.data));

        result.data.hashtags.forEach((tagobj) => {
            let hashtag = new model.HashTag(tagobj.hashtag.name, tagobj.hashtag.media_count, new Date().toISOString(), prefix);
            hashtags.push(hashtag);
        })
    } catch (error) {
        console.error(error)
    }
    return hashtags;
};