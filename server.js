const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./db");

app.use(bodyParser());
app.use(cors());
app.use(express.static(path.resolve(__dirname, "public")));
app.set("port", process.env.port || 3000);

app.post("/getData", (req, res) => {
  var data = req.body;
  db.get(data).then((r) => {
    res.send(r);
  });
});
app.post("/save", (req, res) => {
  var data = req.body;
  console.log(data);
  db.save(data).then((r) => {
    res.send(r);
  });
});
app.listen(app.get("port"), (server) => {
  console.info(`Server listen on port ${app.get("port")}`);
});
