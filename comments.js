// Create web server application with Node.js 

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Comment = require('./models/comment');

// Create express app
const app = express();

// Set up mongoose connection
const mongoDB = 'mongodb://localhost:27017/comments';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.Promise = global.Promise;

// Set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up cors
app.use(cors());

// Set up static files
app.use(express.static('public'));

// Set up routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/comments', (req, res) => {
    Comment.find({}, (err, comments) => {
        if (err) {
            console.log(err);
        } else {
            res.json(comments);
        }
    });
});

app.post('/comments', (req, res) => {
    const comment = new Comment(req.body);
    comment.save()
        .then(comment => {
            res.json(comment);
        })
        .catch(err => {
            res.status(400).send('adding new comment failed');
        });
});

app.get('/comments/:id', (req, res) => {
    let id = req.params.id;
    Comment.findById(id, (err, comment) => {
        res.json(comment);
    });
});

app.put('/comments/:id', (req, res) => {    
    Comment.findById(req.params.id, (err, comment) => {
        if (!comment)
            res.status(404).send('data is not found');
        else
            comment.author = req.body.author;
            comment.text = req.body.text;
            comment.save().then(comment => {
                res.json(comment);
            })
            .catch(err => {
                res.status(400).send('Update not possible');
            });
    });
});

app.delete('/comments/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id, (err, comment) => {
        if (!comment)
            res.status(404).send('data is not found');
        else
            res.json('Comment deleted!');
    });
});

// Set up port
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Export app
module.exports = app;

