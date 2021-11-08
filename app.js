const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/usersDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: {
    type: String,
    immutable: true,
  },
})

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
        res.send("saved user successfully")
      }
    })
  })
  .delete(function (req, res) {
    User.deleteMany(function (err) {
      if (!err) {
        console.log("Successfully deleted user")
      }
    })
  })

/////////////Requesting Particlar User///////

app
  .route("/user/:name")

  .get(function (req, res) {
    /////To find a single user if it exists and read its details/////

    User.findOne(
      {
        name: req.params.name,
      },
      function (err, founduser) {
        if (founduser) {
          res.send(founduser)
        } else {
          res.send("No matching user found")
        }
      }
    )
  })

  .patch(function (req, res) {
    User.replaceOne(
      {
        name: req.params.name,
      },
      {
        name: req.body.name,
        username: req.body.username,
      },
      function (err) {
        if (!err) {
          res.send("Updated user successfully")
        } else {
          res.send("Cant update")
        }
      }
    )
  })
  .delete(function (req, res) {
    User.deleteOne({ name: req.params.name }, function (err) {
      if (!err) {
        res.send("deleted successfully")
      } else {
        res.send("cant delete user")
      }
    })
  })

//Listening//

app.listen(3000, function () {
  console.log("Server started successfully on port 3000")
})
