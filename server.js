const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 3002;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "notes.html"));
});

//get notes
app.get("/api/notes", (req, res) => {
  try{
    notes = fs.readFileSync("db/db.json", "utf8");
    notes = JSON.parse(notes);
    res.json(notes);
  }
  catch (err){
    res.status(403).json({e});
  }

});

app.post("/api/notes", (req, res) => {
  const text = req.query;
  if(!text){
    return res.json({error: "You must enter a text"});
  }
  try {
      newNotes = fs.readFileSync("db/db.json", "utf8");
      newNotes = JSON.parse(newNotes);
     
      //adds notes to the body
      newNotes.push(text)
      newNotes = JSON.stringify(newNotes, null, 2);

      //Json turns parsed notes into a string for user
      fs.writeFile("db/db.json", newNotes, "utf8", function (e) {
        if (e) throw e;
      });
  }
  catch (e) {
    if (e) throw e;
  }
  res.json(JSON.parse(newNotes));
});

app.listen(PORT, () => {
  console.log("the server is listening on PORT: " + PORT);
});