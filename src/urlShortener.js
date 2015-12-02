import Promise from 'bluebird';
import BitlyAPI from 'node-bitlyapi';
import path from 'path';
import getDataConnector from './getDataConnector';

let knex = getDataConnector();

let BITLY_ACCESS_TOKEN = process.env.BITLY_ACCESS_TOKEN;

let Bitly = new BitlyAPI();
Bitly.setAccessToken(BITLY_ACCESS_TOKEN);

function getFromCache(longUrl) {
    return knex
        .from('urls')
        .where({
            long_url: longUrl
        })
        .first('short_url')
        .then(item => (item && item.short_url))
}

function saveToCache(longUrl, shortUrl) {
    return knex
        .insert({
            long_url: longUrl,
            short_url: shortUrl
        })
        .into('urls')
        .then(() => shortUrl)
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
