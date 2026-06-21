const express = require('express');
const app = express();
const Parser = require('rss-parser');
const path = require('path');
const cors = require('cors');

app.use(cors());

const parser = new Parser();
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/news', async (req, res) => {
    try {
       const feed = await parser.parseURL(
               'https://feeds.bbci.co.uk/hindi/rss.xml'
        );
        console.log(feed.title);
       const articles = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            description: item.contentSnippet
        }));

        res.json({ articles });

    } catch (error) {


        res.status(500).json({
            error: 'Failed to fetch news data'
        });
    }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
