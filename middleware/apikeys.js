const keys = require('../data/keys.json');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const newKey = () => {
    const newKey = uuid();
    keys.push(newKey);
    fs.writeFile('./data/keys.json', JSON.stringify(keys), (err) => {
        if (err) throw err;
    });
    return newKey;
}

const validateKey = (req, res, next) => {
    let api_key = req.query.api_key;

    if (keys.find(key => key === api_key)) {
        next();
    }
    else {
        res.status(401).send('You are not authenticated, please get an API key first at /register')
    }
}

module.exports = { newKey, validateKey };