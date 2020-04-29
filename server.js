const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid/v4");

const app = express();
const PORT = process.env.PORT || 3001;
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

//api call to get notes
app.get("/api/notes", (req, res) => {
  try{
    notes = fs.readFileSync("db/db.json", "utf8");
    notes = JSON.parse(notes);
    res.json(notes);
  }
  catch (err){
    res.status(403).json({err});
  }

});

// api call to post 
app.post("/api/notes", (req, res) => {
  const text = req.body;
  // const uniqueId = Math.floor(Math.random()*100);
  const longId = uuid();
  const fourDigitId = longId.substr(0,4);
  text.id = fourDigitId;
 
  if(!text){
    return res.json({error: "You must enter a text"});
  }
  try {
      newNotes = fs.readFileSync("db/db.json", "utf8");
      console.log(newNotes);

      newNotes = JSON.parse(newNotes);
      //adds notes to the body
      // text.id = uniqueId;
      newNotes.push(text);
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

//api call to delete notes with id
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  try{
    notes = fs.readFileSync("db/db.json", "utf8");
    notes = JSON.parse(notes);
    // console.log(newNotes.length);
    // console.log(newNotes[0].id);
    console.log("this is id from the user", id);
    for (let i = 0; i < notes.length; i++){
      const dataId = notes[i].id;
      if(dataId == id){
        // delete notes[i];
        notes.splice(i, 1);
        // console.log(notes);
        updateNotes = JSON.stringify(notes, null, 2);
        fs.writeFile("db/db.json",(updateNotes), "utf8", function (e) {
          if (e) throw e;
        });
      }
      // else{
      //   return res.json("Id you enter is not valid!");
      // }
      // return res.json("Id you enter is not valid!");
    }
  }catch(e){
    if(e) throw e;
  }
  res.json(notes);

});
//listen to the app
app.listen(PORT, () => {
  console.log("the server is listening on PORT: " + PORT);
});