const express = require('express');
const fs = require('fs');
const videoData = require('../data/videos.json');
const router = express.Router();
const { v4: uuid } = require('uuid');

const API = require('../middleware/apikeys');

router.get('/register', (req, res) => {
    const newKey = API.newKey();
    res.json({"api_key":newKey});
});

router.get('/videos', API.validateKey, (req, res) => {
    const vidData = videoData.map(video => ({
        "id": video.id,
        "title": video.title,
        "channel": video.channel,
        "image": video.image
    }));

    res.send(vidData);
});

router.get('/videos/:id', API.validateKey, (req, res) => {
    const video = videoData.find(video => video.id === req.params.id)
    res.send(video);
});

router.post('/videos', API.validateKey, (req, res) => {
    
    const { title, description, image } = req.body;
    const videoToAdd = {
        id: uuid(),
        title: title,
        channel: 'BrainStation Magic Fun Time',
        image: image,
        description: description,
        views: 0,
        likes: 0,
        duration: '1:09',
        video: 'https://project-2-api.herokuapp.com/stream',
        timestamp: Date.now(),
        comments: [
            {
                "name": "Niko Guerra",
                "comment": "Wow this is such a cool video! Every time the rabbit looks at the butterfly it sends chills down my spine!",
                "id": uuid(),
                "likes": 0,
                "timestamp": 1545162149000
            },
            {
                "name": "Eula Bengco",
                "comment": "So much happens here in just 10 seconds! I needed a box of tissues when I saw the butterfly get squished by the apple. TRIGGER WARNING!",
                "id": uuid(),
                "likes": 0,
                "timestamp": 1544595784046
            },
            {
                "name": "Dave Ashe",
                "comment": "If you like this video you should check out my really old resume page that is littered with cat GIFs. Who doesn't love cat GIFs?!",
                "id": uuid(),
                "likes": 0,
                "timestamp": 1542262984046
            }
        ]
    }
    
    videoData.push(videoToAdd);
    
    fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err) => {
        if (err) throw err;
    });

    res.send('video uploaded!');
});

router.put('/videos/:videoId/likes', API.validateKey, (req, res) => {
    
});

module.exports = router;