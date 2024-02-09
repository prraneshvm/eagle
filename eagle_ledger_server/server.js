const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserModel = require("./models/users");

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

const url = 'mongodb://3.98.123.149:27017'
//const url = "mongodb://localhost:27017";

mongoose
  .connect(`${url}/Login`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Login");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Login", err.message);
  });

const LogInCollection = mongoose.model("LogInCollection", {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dbCollection: String,
  dbName: String,
  dbPassword: String,
  dbUserName: String,
});

app.post("/send", (req, res) => {
  UserModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

app.get("/fetch/:id", async (req, res) => {
  try {
    const fetchId = req.params.id;
    const user = await UserModel.findOne({ id: fetchId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/update/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: userId },
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const existingUser = await LogInCollection.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }
    const newUser = new LogInCollection({
      username: req.body.username,
      password: req.body.password,
    });
    await newUser.save();
    res.status(201).json({ message: "Signup successful! Please log in." });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const existingUser = await LogInCollection.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (!existingUser) {
      return res.status(200).json({ message: "Invalid credentials." });
    }
    res.status(200).json({ message: "LoginSuccess", existingUser });
    mongoose.disconnect();
    mongoose
      .connect(`${url}/${existingUser?.dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(`Connected to MongoDB ${existingUser?.dbName}`);
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/logout", async (_req, res) => {
  try {
    mongoose.disconnect();
    mongoose
      .connect(`${url}/Login`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Logged out, connected to MongoDB Login");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB Login", err.message);
      });
    res.status(200).json({ message: "LogoutSuccess" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(4000, () => {
  console.log("Server started on port 4000" , url);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
