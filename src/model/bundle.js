import defaults from 'defaults';
import Promise from 'bluebird';
import superagent from 'superagent';

const API_URL = process.env.API_URL;
const request = require('superagent-promise')(superagent, Promise);

function get(id) {
    return request
        .get(`${API_URL}/v1/bundles/${id}`)
        .end()
        .then(res => res.body);
}

function list(params) {
    var options = defaults(params, {
        page: 1,
        pageSize: 10
    });

    return request
        .get(`${API_URL}/v1/bundles?page=${options.page}&pageSize=${options.pageSize}`)
        .end()
        .then(res => res.body);
}

export default {
    get,
    list
};
