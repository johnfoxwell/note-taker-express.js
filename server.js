// Import
const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
// Helper method for generating unique ids
const uuid = require('./helper/uuid');

const app = express();
// const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);


// API (fetch)

// GET request for notes
app.get('/api/notes', (req, res) => {
    // Log our request to the terminal
    console.log(`${req.method} request received to get notes`);
    res.status(200).json(notes);
});

// POST api/notes
app.post('/api/notes', (req, res) => {
  console.log(`${req.method} request received to add a new note`);

  // Destructuring assignment
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };
  
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if(err) {
        console.log(err)
      } else {
        const parsedNotes = JSON.parse(data);
        
        //Add new note
        parsedNotes.push(newNote)

        fs.writeFile("db/db.json", JSON.stringify(parsedNotes), (err,data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully written a review")
          }
        })
      }
    }); 

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting a note');
  }
});

// Listen() method
// app.listen(process.env.PORT, () =>
//   console.log(`Example app listening at http://localhost:${PORT}`)
// );