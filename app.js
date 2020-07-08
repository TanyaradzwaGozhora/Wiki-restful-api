const mongoose = require('mongoose');
const ejs = require('ejs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
mongoose.connect('mongodb://localhost/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')

    .get(function (req,res) {
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }

    });
    })

    .post(function(req, res){

    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        } else{
            res.send(err);
        }
    });
    })

    .delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles")
        } else{
            res.send(err)
        }
    });
});



app.route('/articles/:articleTitle')

    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send('No articles matching that title were found');
            }
        });
    })
//put replaces the document with a new document only having
    // the edited fields
    .put(function(req,res){
        Article.update(
            {title: req.params.articleTitle},
            {title:req.body.title, content:req.body.content},
            {overwrite: true},
            function(err) {
                if (!err) {
                    res.send('Successfully updated');
                } else {
                    res.send(err);
                }
            })
    })
//patch replaces
    .patch(function(req,res){
        Article.update(
            {title: req.params.articleTitle},
            {$set:req.body},
            function(err){
                if(!err){
                    res.send('Successfully updated article')
                } else{
                    res.send(err);
                }
            }
        );
    })

    .delete(function(req,res){
        Article.deleteOne(
            {title:req.params.articleTitle},
            function(err){
                if(!err){
                    res.send('Successfully deleted');
                } else{
                    res.send(err)
                }
            }
        );
    });





app.listen(3000, ()=> console.log('Server listening at port 3000'));