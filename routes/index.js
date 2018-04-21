var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var expressSanitizer = require('express-sanitizer');

router.use(expressSanitizer());

//MONGOOSE/Schema model CONIFIG
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created:
       {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test blog",
//     image: "https://d3hne3c382ip58.cloudfront.net/resized/750x420/annapurna-base-camp-trek-tour-2-19503_1517832769.JPG",
//     body: "Hye this is a test blog"
// });

//ROUTES
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/blogs');
});

router.get('/blogs', function (req, res, next) {
    Blog.find({}, function (err, blogs) {
       if(err){
           console.log("Error occured reading the blog");
       } else {
           res.render('index', {title: "Blogs", blogs: blogs} );
       }
    });
});
//NEW
router.get('/blogs/new', function (req, res, next) {
    res.render('new');
});

//CREATE
router.post('/blogs', function (req, res, next) {
    req.body.blogBody = req.sanitize(req.body.blogBody);
    var blog = {
        title: req.body.blogName,
        image: req.body.blogImage,
        body: req.body.blogBody
    };
    Blog.create(blog, function (err, newBlog) {
        if(err){
            res.render("new");
        } else {
            res.redirect('/blogs');
        }
    });
});

//SHOW ROUTE
router.get("/blogs/:id", function (req, res, next) {
    Blog.findById(req.params.id, function (err, foundBlog) {
       if(err){
           console.log("NOt Found");
       } else {
           res.render("show", {blog: foundBlog});
       }
    });
});

//UPDATE Route
router.get("/blogs/:id/edit", function (req, res, next) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err){
            console.log("NOt Found");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

router.put("/blogs/:id", function (req, res, next) {
    req.body.blogBody = req.sanitize(req.body.blogBody);
    var blog = {
        title: req.body.blogName,
        image: req.body.blogImage,
        body: req.body.blogBody
    };
   Blog.findByIdAndUpdate(req.params.id, blog,  function (err, editBlog) {
      if(err){
          console.log("Error while updating");
          res.redirect('/blogs');
      } else {
          res.redirect('/blogs/'+ req.params.id);
      }
   });
});

//DESTROY ROUTE
router.delete("/blogs/:id", function (req, res, next) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
       if(err){
           console.log("error while delete");
       } else {
           res.redirect("/blogs");
       }
    });
});


module.exports = router;
