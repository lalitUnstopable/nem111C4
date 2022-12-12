const express = require("express");
require("dotenv").config()
const jwt = require("jsonwebtoken");
const { connection } = require("./config/db");
const { UserModel } = require("./Model/User.model");
const bcrypt = require("bcrypt");
const cors = require("cors");

const { authentication } = require("./middlewares/authentication");
const { todosRouter } = require("./routes/todos.route");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const usePresent = await UserModel.findOne({ email });
  // TODO
  if (usePresent?.email) {
    res.send("Try logging in, already exist");
  }
  else{
    try {
      bcrypt.hash(password, 5, async function (err, hash) {
        const user = new UserModel({ email, password: hash });
        await user.save();
        res.send("Sign-Up Successfull");
      });
    } catch (err) {
      console.log(err);
      res.send("Something went wrong, pls try again later");
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });

    if (user.length > 0) {
      const hashed_password = user[0].password;
      bcrypt.compare(password, hashed_password, function (err, result) {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "hush");
          res.send({ msg: "Login successfull", token: token });
        } else {
          res.send("Login failed");
        }
      });
    } else {
      res.send("Login failed");
    }
  } catch {
    res.send("Something went wrong, please try again later");
  }
});


app.use(authentication);
app.use("/todos", todosRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB Successfully");
  } catch (err) {
    console.log("Error connecting to DB");
    console.log(err);
  }
  console.log(`Listening on PORT ${process.env.PORT}`);
});