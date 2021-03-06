const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const articleSchema = {
	title: String,
	content: String,
};

const Article = mongoose.model("article", articleSchema);

app
	.route("/articles")

	.get((req, res) => {
		Article.find({}, (err, foundArticles) => {
			if (!err) {
				res.send(foundArticles);
			} else {
				res.send(err);
			}
		});
	})

	.post((req, res) => {
		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content,
		});
		newArticle.save((err) => {
			if (!err) {
				res.send("no errors, successfully posted");
			} else {
				res.send(err);
			}
		});
	})

	.delete((req, res) => {
		Article.deleteMany({}, (err) => {
			if (!err) {
				res.send("deleted successfully");
			} else {
				res.send(err);
			}
		});
	});

app.get("/", (req, res) => {
	res.send("hello");
});

app
	.route("/articles/:articleTitle")

	.get((req, res) => {
		Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
			if (foundArticle) {
				res.send(foundArticle);
			} else {
				res.send("not found");
			}
		});
	})

	.put((req, res) => {
		Article.update(
			{ title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            {overwrite: true},
            (err)=>{
                if(!err){
                    res.send("updated");
                }
                else{
                    res.send(err);
                }
            }
		);
    })
    
    .patch((req,res)=>{
        Article.update(
            {title: req.params.articleTitle},
            {$set:  req.body},
            (err)=>{
                if(!err){
                    res.send("updated");
                }
                else{
                    res.send(err);
                }
            }
        )
    })

    .delete((req,res)=>{
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err)=>{
                if(!err){
                    res.send("deleted");
                }
                else{
                    res.send(err);
                }
            }
        )
    });

app.listen(3000);
