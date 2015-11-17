import express from 'express';
import moment from 'moment';
import consolidate from 'consolidate'
import Bundle from './model/bundle';

var BASE_URL = process.env.BASE_URL;

var app = express();
app.engine('nunjucks', consolidate.nunjucks);
app.set('view engine', 'nunjucks');
app.set('views', __dirname + '/views');

function prepareBundleObject(bundle) {
    bundle.created_at = moment(bundle.created_at).calendar();
    return bundle;
}

app.get('/bundles/:id', (req, res) => {
    let id = req.params.id;

    Bundle.get(id).then(bundle => {

        res.render('bundle', {
            BASE_URL: BASE_URL,
            bundle: prepareBundleObject(bundle)
        });
    });
});

app.get('/bundles/:id/install', (req, res) => {
    let id = req.params.id;

    Bundle.get(id).then(bundle => {

        res.render('install', {
            BASE_URL: BASE_URL,
            bundle: prepareBundleObject(bundle)
        });
    });
});

app.get('/', (req, res) => {
    Bundle.list(req.query).then(list => {
        res.render('list', {
            BASE_URL: BASE_URL,
            list: list.map(prepareBundleObject),
            query: req.query
        });
    });
});

export default app;
