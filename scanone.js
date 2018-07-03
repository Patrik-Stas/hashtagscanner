let winston = require('winston');
winston.add(new winston.transports.Console());

const fs = require('fs-extra');
const path = require('path');
const scanner = require('./src/scanner');


const cookiePath = path.resolve(__dirname, 'cookies', 'cookie.txt');
const cookie = fs.readFileSync(cookiePath, 'utf8');

async function scan() {
    let prefix = "ab";
    winston.info(`Scanning ${prefix}`);
    hashtags = await scanner.scanPrefix(cookie, prefix);
    winston.info(`Number of hastags returned ${hashtags.length}`);
    winston.info(JSON.stringify(hashtags));

}

scan();