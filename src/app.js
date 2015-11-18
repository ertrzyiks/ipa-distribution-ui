import express from 'express';
import moment from 'moment';
import consolidate from 'consolidate'
import Bundle from './model/bundle';

var BASE_URL = process.env.BASE_URL;
var LOTTERY_CHANCE = process.env.LOTTERY_CHANCE || 0

var app = express();
app.engine('nunjucks', consolidate.nunjucks);
app.set('view engine', 'nunjucks');
app.set('views', __dirname + '/views');

app.use('/public', express.static(__dirname + '/../public'));
app.use('/themes', express.static(__dirname + '/../themes'));

function prepareBundleObject(bundle) {
    bundle.created_at = moment(bundle.created_at).calendar();
    return bundle;
}

function getBaseColor(chance) {
    if ((Math.random() * 100) < chance) {
        return 'pink';
    }

    return 'blue';
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

    let baseColor = getBaseColor(LOTTERY_CHANCE);

    Bundle.get(id).then(bundle => {

        res.render('install', {
            BASE_URL: BASE_URL,
            bundle: prepareBundleObject(bundle),
            baseColor
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
