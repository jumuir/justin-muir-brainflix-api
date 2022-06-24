const express = require('express');
const cors = require('cors');
const app = express();


require("dotenv").config();
const { PORT } = process.env;

const videoRoutes = require('./routes/videos');
 
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));
app.use('/', videoRoutes);


app.listen(PORT, ()=> console.log(`Running with the devil on port ${PORT}`));