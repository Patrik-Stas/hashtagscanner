let cron = require('node-cron');
let winston = require('winston');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

class HashTag {
    constructor(name, count, scantime) {
        this.name = name;
        this.count = count;
        this.scantime = scantime;
    }
}

const axiosScan = async (cookie, prefix) => {
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
        // console.log("Received result from instagram");
        // console.log(result.header);
        // console.log(JSON.stringify(result.data));


        result.data.hashtags.forEach((tagobj) => {
            let hashtag = new HashTag(tagobj.hashtag.name, tagobj.hashtag.media_count, new Date());
            hashtags.push(hashtag);
        })
    } catch (error) {
        console.error(error)
    }
    return hashtags;
};

//
// async function scan(cookie, prefix) {
//     https.get(url, (resp) => {
//         let data = '';
//
//         resp.on('end', () => {
//             console.log("Got response from instagram!");
//             console.log(JSON.parse(data).explanation);
//             // tags = pyjq.first('[.hashtags[].hashtag | {name:.name, count:.media_count}]', r.json())
//             // sorted(tags, key=lambda x: x["count"])
//         });
//
//     }).on("error", (err) => {
//         console.log("Error: " + err.message);
//     });
// }

const cookiePath = path.resolve(__dirname, 'cookies', 'cookie.txt');
const cookie = fs.readFileSync(cookiePath, 'utf8');

// axiosScan(cookie, "prague");
let targets = ["prague", "winter", "drawing", "pretty"];
let index = 0;

cron.schedule('*/3 * * * * *', async function () {
    prefix = targets[index];

    console.log(`... Scanning tag ${prefix}`);
    hashtags = await axiosScan(cookie, prefix);
    hashtags.forEach((hashtag, index)=> {
        console.log(`${prefix} ${index}: ${JSON.stringify(hashtag)}`);
    });

    index++;
});
