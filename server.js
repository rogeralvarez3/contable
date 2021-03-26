const express = require("express");
const app = express();
//const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const history = require("connect-history-api-fallback");
const io = require("socket.io");


app.use(history());
app.use(express.json({ limit: '100mb' }));

app.use(cors());
app.use(express.static(path.resolve(__dirname, "dist")));
app.use(express.static(path.resolve(__dirname, "temp")));
app.use(express.static(path.resolve(__dirname, "fonts")));
app.set("port", process.env.port || 3000);


app.post("/get", (req, res) => {
  var data = req.body;
  console.log(data)
  db.get(data).then((r) => {
    res.send(r);
  });
});
app.post("/exeSP", (req, res) => {
  var data = req.body;
  console.log(data)
  db.exeSP(data.sp).then((r) => {
    res.send(r);
  });
})
app.post("/save", (req, res) => {
  var data = req.body;
  console.log(data);
  db.save(data).then((r) => {
    res.send(r);
  });
});

let httpServer = app.listen(app.get("port"), () => {
  console.info(`Server listen on port ${app.get("port")}`);
});
let sockets = io(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

sockets.on("connection", sck => {
  console.log('cliente conectado');
})
