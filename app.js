const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const transferRouter = require("./routes/transferRoute.js");
const authRouter = require("./routes/authRouter.js");
const authenticationMiddleware = require("./middleware/authenticationMiddleware.js")

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
  let db;
  try {
    const client = await new MongoClient("mongodb://localhost:27017").connect();
    db = client.db("Revou");
  } catch (error) {
    console.log(error, "<=================== error ==================");
    return res.status(500).json({ error: "Database connection error" });
  }

  req.db = db;

  next();
});

app.get("/", (req, res) => {
  res.send("My App");
});

app.use("/auth", authRouter);
app.use("/v1/transfers", authenticationMiddleware, transferRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}`);
});