const express = require('express');
const fs = require('fs');
const videoData = require('../data/videos.json');
const router = express.Router();
const { v4: uuid } = require('uuid');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });


const API = require('../middleware/apikeys');

// register new API key
router.get('/register', (req, res) => {
    const newKey = API.newKey();
    res.status(201).json({"api_key":newKey});
});

// return side video data
router.get('/videos', API.validateKey, (req, res) => {
    const vidData = videoData.map(video => ({
        "id": video.id,
        "title": video.title,
        "channel": video.channel,
        "image": video.image
    }));

    res.send(vidData);
});

// return main video data
router.get('/videos/:id', API.validateKey, (req, res) => {
    const video = videoData.find(video => video.id === req.params.id)
    res.send(video);
});

// post new video 
router.post('/videos', API.validateKey, upload.single('image'), (req, res) => {
    
    const { title, description } = req.body;

    let image = 'http://localhost:8080/images/upload-default.jpg';
    if (req.file) {
        image = `http://localhost:8080/images/${req.file.filename}`;
    }
    
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
                "timestamp": (Date.now() + 3000)
            },
            {
                "name": "Eula Bengco",
                "comment": "So much happens here in just 10 seconds! I needed a box of tissues when I saw the butterfly get squished by the apple. TRIGGER WARNING!",
                "id": uuid(),
                "likes": 0,
                "timestamp": (Date.now() + 2000)
            },
            {
                "name": "Dave Ashe",
                "comment": "If you like this video you should check out my really old resume page that is littered with cat GIFs. Who doesn't love cat GIFs?!",
                "id": uuid(),
                "likes": 0,
                "timestamp": (Date.now() + 1000)
            }
        ]
    }
    
    videoData.push(videoToAdd);
    
    fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err) => {
        if (err) throw err;
    });

    res.status(201).send(videoToAdd);
});

// post new comment to video
router.post('/videos/:id/comments', API.validateKey, (req, res) => {
    const { name, comment } = req.body;
    const newComment = {
        "id": uuid(),
        "name": name,
        "comment": comment,
        "likes":0,
        "timestamp": Date.now()
    }

    const videoIndex = videoData.findIndex(video => video.id === req.params.id);
    videoData[videoIndex].comments.push(newComment);

    fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err) => {
        if (err) throw err;
    });

    res.status(201).send(newComment);
});

// delete comment from video
router.delete('/videos/:videoId/comments/:commentId', API.validateKey, (req, res) => {
    const videoIndex = videoData.findIndex(video => video.id === req.params.videoId);
    const commentIndex = videoData[videoIndex].comments.findIndex(comment => comment.id === req.params.commentId);
    videoData[videoIndex].comments.splice(commentIndex, 1);

    fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err) => {
        if (err) throw err;
    });

    res.send("Comment deleted!");
});

// like a video
router.put('/videos/:videoId/likes', API.validateKey, (req, res) => {
    videoData.forEach(video => {
        if (video.id === req.params.videoId) {
            console.log(video.id, video.likes);
            video.likes = Number(video.likes) + 1;
            console.log(video.id, video.likes);

            fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err) => {
                if (err) throw err;
            });
            
            res.send(video);
        }
    })
});

// add a view to the video
router.put('/videos/:videoId/views', API.validateKey, (req, res) => {
    videoData.forEach(video => {
        if (video.id === req.params.id) {
            
            video.views = Number(video.views) + 1;

            fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err) => {
                if (err) throw err;
            });
            
            res.send(video);
        }
    })
});

module.exports = router;