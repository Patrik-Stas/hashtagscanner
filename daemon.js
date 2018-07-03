let cron = require('node-cron');
let winston = require('winston');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const scanner = require('./src/scanner');
const model = require('./src/model');


const cookiePath = path.resolve(__dirname, 'cookies', 'cookie.txt');
const cookie = fs.readFileSync(cookiePath, 'utf8');

let index = 0;

cron.schedule('*/3 * * * * *', async function () {
    prefix = targets[index];

    winston.info(`... Scanning tag ${prefix} ... `);
    hashtags = await scanner.scanPrefix(cookie, prefix);

    hashtags.forEach((hashtag, index) => {
        console.log(`${prefix} ${index}: ${JSON.stringify(hashtag)}`);
        let record = new model.HashTag({name: hashtag.name, count: hashtag.count, scantime: hashtag.scantime});
        record.save(function (err, saved) {
            if (err) return console.error(err);
            console.log(`New tag saved ${saved.name}`);
        });
    });

    index++;
});

