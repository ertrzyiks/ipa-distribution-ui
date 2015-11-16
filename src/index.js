import app from './app';

export function start(port = 3000) {
    app.listen(port);

    console.log(`Listening on ${port}`);
}
