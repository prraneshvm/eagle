const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserModel = require("./models/users");
// const LogInCollection = require("./models/users");
const multer = require("multer");

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/Login", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to main database");
  })
  .catch((err) => {
    console.error("Error connecting to main database:", err.message);
  });



const storage = multer.memoryStorage();

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
      { new: true } // Return the modified document rather than the original
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    // Handle specific types of errors if needed
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const LogInCollection = mongoose.model("LogInCollection", {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dbCollection: String,
  dbName: String,
  dbPassword: String,
  dbUserName: String,
});

// Signup route
app.post("/signup", async (req, res) => {
  try {
    // Convert the username to lowercase for case-insensitive comparison
    const existingUser = await LogInCollection.findOne({
      username: req.body.username?.toLowerCase(),
    });
    console.log("Existing User:", existingUser);
    console.log("Signup Request:", req.body);

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }

    const newUser = new LogInCollection({
      username: req.body.username.toLowerCase(), // Save the username in lowercase
      password: req.body.password,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful! Please log in." });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      // Duplicate key error (MongoDB unique constraint violation)
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    // Convert the username to lowercase for case-insensitive comparison
    const existingUser = await LogInCollection.findOne({
      username: req.body.username?.toLowerCase(),
      password: req.body.password,
    });

    if (!existingUser) {
      return res.status(200).json({ message: "Invalid credentials." });
    }

    console.log("existingUser", existingUser);

    // You may perform additional validation, authentication, or token generation here

    res.status(200).json({ message: "LoginSuccess", existingUser });
    mongoose.disconnect();
    mongoose
      .connect(`mongodb://localhost:27017/${existingUser?.dbName}`, {
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

app.get("/logout", async (req, res) => {
  try {
    mongoose.disconnect();
    mongoose
      .connect("mongodb://localhost:27017/Login", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB Login");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB: Login", err.message);
      });
    res.status(200).json({ message: "LogoutSuccess" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
