import Promise from 'bluebird';
import BitlyAPI from 'node-bitlyapi';
import NodeCache from 'node-cache';

let BITLY_ACCESS_TOKEN = process.env.BITLY_ACCESS_TOKEN;

let Bitly = new BitlyAPI();
Bitly.setAccessToken(BITLY_ACCESS_TOKEN);

let urlCache = new NodeCache({ stdTTL: 1000, checkperiod: 1200 });

function getFromCache(key) {
    return new Promise((resolve, reject) => {
        urlCache.get(key, (err, value) => {
            if (err) {
                return reject(err);
            }

            return resolve(value);
        });
    });
}

function saveToCache(key, value) {
    return new Promise((resolve, reject) => {
        urlCache.set(key, value, (err, success) => {
            if (err || !success) {
                return reject(err);
            }

            return resolve(value);
        });
    });
}

function getShortUrl(longUrl) {
    return new Promise((resolve, reject) => {
        Bitly.shorten({ longUrl }, (err, text) => {
            if (err) {
                return reject(err);
            }

            let result = JSON.parse(text);

            if (result.status_code != 200) {
                return reject(result);
            }

            return resolve(result.data.url);
        });
    });
}

export default function (longUrl) {
    if (!BITLY_ACCESS_TOKEN) {
        return Promise.resolve(longUrl);
    }

    return getFromCache(longUrl)
        .then((shortUrl) => {
            if (shortUrl) {
                return shortUrl;
            }

            return getShortUrl(longUrl)
                .then(value => saveToCache(longUrl, value));
        });
}
