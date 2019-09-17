const express = require("express");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");

var db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webScrape"

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
    axios.get("http://www.echojs.com/").then(function(response) {
      var $ = cheerio.load(response.data);
  
      $("article h2").each(function(i, element) {
        var result = {};
  
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
  
      res.send("Scrape Complete");
    });
  });

  app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle){
      res.json(dbArticle)
    }).catch(function(err) {
      res.json(err);
    });
  });
  
  app.get("/articles/:id", function(req, res) {
    
    db.Article.findOne({
      _id: req.params.id
    })
    .populate("note").then(function(results){
      res.json(results)
    }).catch(function(err) {
      res.json(err);
    });
  
  });
  
  app.post("/articles/:id", function(req, res) {
   
    db.Note.create(req.body).then(function(dbNote){
      return db.Article.findOneAndUpdate({_id:req.params.id}, { $push: { note: dbNote._id } }, { new: true });
  
    }).then(function(db){
      res.json(db)
    })
  });



app.listen(PORT,function(){
    console.log("Now listening on port: "+ PORT);
})