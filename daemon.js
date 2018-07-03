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

async function getNextTagToScan() {

    result = await model.HashTag.find({was:prefix}).exec();
}


cron.schedule('*/3 * * * * *', async function () {

    winston.info(`... Scanning tag ${prefix} ... `);
    hashtags = await scanner.scanPrefix(cookie, prefix);

    hashtags.forEach((hashtag, index) => {
        console.log(JSON.stringify(result));
        if (result.length) {
            console.log(`tag ${prefix} already contained in db. Skipping.`)
        }
        else {
            console.log(`Tag ${prefix} missing in database`);
        }

        console.log(`${prefix} ${index}: ${JSON.stringify(hashtag)}`);
        hashtag.save(function (err, saved) {
            if (err) return console.error(err);
            console.log(`New tag saved ${saved.name}`);
        });
    });
});

