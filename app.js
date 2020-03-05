//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose')
const _ = require('lodash')

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-victor:NmppcXYi6p0fsCRc@cluster0-1fmqg.mongodb.net/blogpostsDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

const blogSchema = {
  title:String,
  content:String
}

const Blog = mongoose.model("Blog", blogSchema)

let posts = []

app.get('/', (req,res) => {
  Blog.find({}, (err, foundPosts)=> {
    res.render(__dirname + "/views/home.ejs", {
      startingContent: homeStartingContent,
      posts: foundPosts
    })
  })
  
})

app.get('/about', (req,res) => {
  res.render(__dirname + "/views/about.ejs", {aboutContent: aboutContent})
})

app.get('/contact', (req,res) => {
  res.render(__dirname + "/views/contact.ejs", {contactContent: contactContent})
})

app.get('/compose', (req,res) => {
  res.render(__dirname + "/views/compose.ejs")
})

app.post('/compose', async (req,res) => {
  let post = new Blog({
    title: req.body.title,
    content: req.body.posttext
  })

  await post.save();
  res.redirect('/');
})

app.get('/posts/:name', (req,res) => {
  const requestedTitle = _.lowerCase(req.params.name)
  Blog.find({}, (err, posts)=>{

    if(err){
    } else {
      posts.forEach(post=>{
        const storedTitle = _.lowerCase(post.title)
        if(storedTitle === requestedTitle){
          res.render("post", {
            title: post.title,
            postcontent: post.content
          })
        }
        else {
          console.log("no match")
        }
      })
    }
  })
})



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
