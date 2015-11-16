import express from 'express';
import moment from 'moment';
import consolidate from 'consolidate'
import Bundle from './model/bundle';

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
            bundle: prepareBundleObject(bundle)
        });
    });
});

app.get('/', (req, res) => {
    Bundle.list(req.query).then(list => {
        res.render('list', {
            list: list.map(prepareBundleObject),
            query: req.query
        });
    });
});

export default app;
