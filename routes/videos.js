const express = require('express');
const fs = require('fs');
const videoData = require('../data/videos.json');
const router = express.Router();
const { v4: uuid } = require('uuid');
const { title } = require('process');

addVideo = (title, desc, img) => {
    return {
        id: uuid(),
        title: title,
        channel: 'BrainStation Magic Fun Time',
        image: img,
        description: desc,
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
}

router.get('/videos', (req, res) => {
    res.send(videoData);
});

router.get('/videos/:id', (req, res) => {
    const video = videoData.find(video => video.id === req.params.id)
    res.send(video);
});

router.post('/videos', (req, res) => {
    const id = uuid();
    const { title, description, image } = req.body;
    const newVideo = addVideo(title, description, image);
    videoData.push(newVideo);
    fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err) => {
        if (err) throw err;
    });
    res.send('video uploaded!');
});

router.put('/videos/:videoId/likes', (req, res) => {
    
});

module.exports = router;