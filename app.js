const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true })

const userSchema = {
  name: String,
  username: String,
  password: String,
}

const User = mongoose.model("User", userSchema)

///////Requesting User////////

app
  .route("/user")
  .get(function (req, res) {
    User.find(function (err, founduser) {
      if (!err) {
        res.send(founduser)
      } else {
        console.log("Error")
      }
    })
  })
  .post(function (req, res) {
    const newuser = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    })

    newuser.save(function (err) {
      if (!err) {
        console.log("saved new user successfully")
      }
    })
  })

//Listening//

app.listen(3000, function () {
  console.log("Server started successfully on port 3000")
})
