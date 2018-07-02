let cron = require('node-cron');
let winston = require('winston');
const https = require('https');

async function scan(cookie, prefix) {

    let headers = {
        'cookie' : cookie,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,cs;q=0.7',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
        'accept': '*/*',
        'referer': 'https://www.instagram.com/explore/tags/prague/',
        'authority': 'www.instagram.com',
        'x-requested-with': 'XMLHttpRequest'
    };

    let options = {
        host: "https://www.instagram.com",
        path: `/web/search/topsearch/?query=%23${prefix}`,
        headers
    };

    https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(JSON.parse(data).explanation);
            // tags = pyjq.first('[.hashtags[].hashtag | {name:.name, count:.media_count}]', r.json())
            // sorted(tags, key=lambda x: x["count"])
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}



cron.schedule('* * * * * *', function(){
    console.log('running a task every second');
});

/*






 */