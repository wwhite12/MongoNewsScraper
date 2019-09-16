const express = require("express");
const PORT = 3000;
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");

var db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webScraper"

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.echojs.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

  app.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({}).then(function(dbArticle){
      res.json(dbArticle)
    }).catch(function(err) {
      res.json(err);
    });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
  
    db.Article.findOne({
      _id: req.params.id
    })
    .populate("note").then(function(results){
      res.json(results)
    }).catch(function(err) {
      res.json(err);
    });
  
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
  
    db.Note.create(req.body).then(function(dbNote){
      return db.Article.findOneAndUpdate({_id:req.params.id}, { $push: { note: dbNote._id } }, { new: true });
  
    }).then(function(db){
      res.json(db)
    })
  });



app.listen(PORT,function(){
    console.log("Now listening on port: "+ PORT);
})