const express = require("express");
const createHttpError = require("http-errors");
const shortId = require("shortid");
const dbConnect = require("./db/db");
const path = require("path");
const ShortUrl = require("./models/url.model");

const app = express();
const PORT = 4000;
const hostname = "127.0.0.4";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
    res.render('index');
});

app.post("/", async (req, res, next) => {
    try {
        const { url } = req.body;
        let result;
        if (isValidUrl(url)) {
            result = await ShortUrl.findOne({ url });
            if (result) {
                res.render('index', { short_url: result.shortId });
                return;
            }
            result = await new ShortUrl({ url:url, shortId: shortId.generate() });
            res.render('index', { short_url: result.shortId });
        } else {
            result = await ShortUrl.findOne({ shortId: url });
            if (!result) {
                throw createHttpError.NotFound("Short URL does not exist");
            }
            res.render('index', { short_url: result.url });
        }
    } catch (error) {
        next(error);
    }
});

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}

app.use((req, res, next) => {
    next(createHttpError.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('index', { error: err.message });
});

app.listen(PORT, hostname, async () => {
    await dbConnect();
    console.log(`Server starts at http://${hostname}:${PORT}`);
});
