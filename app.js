const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const ejs = require("ejs");
var flash = require("connect-flash");
const mongoose = require("mongoose");
const multer = require('multer');
const app = express();

// configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

// const upload = multer({dest: 'uploads'});
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    return cb(null, "upload");
  },
  filename: function(req, file, cb){
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
})
const upload = multer({storage});

app.use(bodyParser.json());
app.use(flash());
mongoose.set("strictQuery", false);
// configure session
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// configure passport
app.use(passport.initialize());
app.use(passport.session());

// configure EJS as the template engine
app.set("view engine", "ejs");

mongoose
  .connect("mongodb://127.0.0.1:27017/IB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.get('/sign_up', (err,res) => {
    res.render("sign_up")
})

app.get('/login', (err,res) => {
    res.render("login")
})

app.get('/index', (err,res) => {
    res.render("index")
})

app.get('/mynetwork', (err,res) => {
    res.render("mynetwork")
})

app.get('/contact', (err,res) => {
    res.render("contact")
})

app.get('/cal_index', (err,res) => {
    res.render("cal_index")
})

app.get('/courses_page', (err,res) => {
    res.render("courses_page")
})

app.get('/expert_video', (err,res) => {
    res.render("expert_video")
})

app.get('/mee_index', (err,res) => {
    res.render("mee_index")
})

app.get('/question', (err,res) => {
    res.render("question")
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const user_Bio_Schema = new mongoose.Schema({
  about:{
    type:String,
  },
  fullName:{
    type:String,
  },
  collage:{
    type:String,
  },
  job:{
    type:String,
  },
  country:{
    type:String,
  },
  address:{
    type:String,
  },
  phone:{
    type:String,
  },
  // profileImage:{
  //   type:String
  // },
  email:{
    type:String,
    unique:true,
  },
  instagram:{
    type:String
  },
  linkedin:{
    type:String
  }
});

const contactSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    subject:{
        type:String,
    },
    message:{
        type:String,
    },
    email:{
        type:String
    }
})

const passSchema = new mongoose.Schema({
  cur_password:{
      type:String
  },
  newpassword:{
      type:String,
      required:true
  },
  renewpassword:{
      type:String,
      required:true
  },
  email:{
    type:String
}
})

const image = new mongoose.Schema({
  profileImage:{
    type:String
  },
  email:{
    type:String
  }
})

// define a User model based on the user schema
const User = mongoose.model("User", userSchema);
const Bio = mongoose.model("Bio", user_Bio_Schema);
const contact = mongoose.model("contact_info",contactSchema);
const change_password = mongoose.model("pass_infos",passSchema);
const Image = mongoose.model("Upload_Image",image);

// configure passport to use LocalStrategy for authentication
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      console.log(user);
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: "Invalid email or password" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Invalid email or password" });
      }
      return done(null, user);
    });
  })
);

// serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user from session storage
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});

// route for login form
app.get("/login", (req, res) => {
  res.render("login", { message: req.flash("error") });
});

// route for handling login form submission
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    usernameField: "email",
  })
);

// route for logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      // Redirect to the login page or homepage
      res.redirect("/login");
    }
  });
});

// route for user signup form
app.get("/sign_up", (req, res) => {
  res.render("sign_up", { message: req.flash("error") });
});

// route for handling user signup form submission
app.post("/sign_up", (req, res) => {
    // console.log("req.body"+req.body);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const bio = new Bio({
    about:"-",
    fullName:"-",
    collage:"-",
    job:"-",
    country:"-",
    address:"-",
    phone:"-",
    profileImage:"-",
    email: req.body.email,
    instagram:"-",
    linkedin:"-"
  })
//   console.log("User"+user);
//    console.log("bio"+bio);

  user.save((err) => {
    if (err) {
      console.log(err);
      req.flash("error", "Error creating user");
      return res.redirect("/sign_up");
    }
    bio.save();
    console.log(user);
    res.redirect("/login");
  });
});

app.get("/", (req, res) => {
    if(!req.user){
       return res.redirect("/login");
    }
  res.render("index");
});

app.get("/prof",(req, res) => {
  // console.log("/prof"+req.body);
  const em = req.user.email;
  // console.log("em"+em);
  if(req.user){
    Bio.findOne({ email : em },function(err,foundbio){
    // console.log("foundbio",foundbio);
    // res.redirect("/");
    
    res.render("prof",{about:foundbio.about,fullName:foundbio.fullName,collage:foundbio.collage,job:foundbio.job,country:foundbio.country,address:foundbio.address,phone:foundbio.phone,email:foundbio.email,instagram:foundbio.instagram,linkedin:foundbio.linkedin});
    })
  }
})


app.post("/prof",(req,res) =>{
  // console.log(req.body);
  // console.log(req.user);
//   const temp = JSON.parse(req.body);

  Bio.updateOne({email:req.user.email},{fullName:req.body.fullName,collage:req.body.collage,job:req.body.job,country:req.body.country,address:req.body.address,about:req.body.about,phone:req.body.phone,instagram:req.body.instagram,linkedin:req.body.linkedin},function(err,updateddata){
  if(err){
    console.log(err);
  }else{
    console.log(updateddata)
  }
  });
  res.redirect("/prof")
})

app.post("/contact", (req, res) => {
  // console.log("req.body"+req.body);
// const cont = new contact({
//   name:req.body.name,
//   email:req.user.email,
//   subject:req.body.subject,
//   message:req.body.message
// });

// cont.save((err) => {
//   if (err) {
//     console.log(err);
//     // req.flash("error", "Error creating user");
//     return res.redirect("/login");
//   }
//   res.redirect("/index");
// });
  contact.updateOne({email:req.user.email},{name:req.body.name,email:req.user.email,subject:req.body.subject,message:req.body.message},function(err,updateddata1){
    if(err){
      console.log(err);
    }else{
      console.log(updateddata1)
    }
    });
    res.redirect("/index")
});

app.post("/change_password", (req, res) => {
  // console.log("req.body"+req.body);
  const pass = new change_password({
    cur_password:req.body.cur_password,
    newpassword:req.body.newpassword,
    renewpassword:req.body.renewpassword,
    email:req.user.email
  });

  pass.save((err) => {
    if (err) {
    console.log(err);
    // req.flash("error", "Error creating user");
    return res.redirect("/login");
  }
  res.redirect("/index"); 
  });
})

app.post("/uploads", upload.single('profileImage'), (req,res) => {
  // console.log(req.body);
  console.log(req.file);
  // const ima = new Image({
  //   profileImage:req.file.filename,
  //   email:req.user.email
  // })

  // ima.save((err) => {
  //   if(err){
  //     console.log(err);
  //     return res.redirect("/login");
  //   }
  //   return res.redirect("/prof");
  // })

  // Image.updateOne({email:req.user.email},{profileImage:req.file.filename},function(err,updateddata1){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     console.log(updateddata1)
  //   }
  //   });
  //   res.redirect("/prof")
});

// start the server
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});