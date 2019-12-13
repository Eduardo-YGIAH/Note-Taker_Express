const express = require("express");
const path = require("path");
const port = process.env.PORT || 3000;
const uuid = require("uuid");
const fs = require("fs");

const app = express();

const db = path.join(__dirname, "./db/db.json");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  "/assets/css",
  express.static(path.join(__dirname, "./public/assets/css"))
);
app.use(
  "/assets/js",
  express.static(path.join(__dirname, "./public/assets/js"))
);

app.use(express.static(path.join(__dirname, "./public")));

app.get("/api/notes", function(req, res) {
  res.sendFile(db);
});

app.post("/api/notes", function(req, res) {
  newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text
  };
  if (!newNote.title || !newNote.text) {
    return res
      .status(400)
      .json({ msg: "Please give a title to your note and add some content" });
  }
  fs.readFile(db, (err, data) => {
    if (err) throw err;
    let file = JSON.parse(data);
    file.push(newNote);
    fs.writeFile(db, JSON.stringify(file, null, 2), err => {
      if (err) throw err;
    });
  });
  res.sendFile(db);
});

app.delete("/api/notes/:id", function(req, res) {
  fs.readFile(db, (err, data) => {
    if (err) throw err;
    let file = JSON.parse(data);
    const newFile = file.filter(obj => obj.id != req.params.id);

    fs.writeFile(db, JSON.stringify(newFile, null, 2), err => {
      if (err) throw err;
    });
  });
  res.sendFile(db);
});

app.listen(port, () => console.log(`Listening on PORT ${port}`));
