var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var port = process.env.PORT || 8000;
app.use(bodyParser.json({ extended: true }));

// CRUD
// create read update delete (destroy)

// Get all users
app.get('/users', function(req, res) {
  fs.readFile('./storage.json', 'utf8', function(err, data){
    if(err) throw err;
    let usersArr = JSON.parse(data);

    res.json(usersArr);
  })
});

// Get one user
app.get('/users/:name', function(req, res) {
  fs.readFile('./storage.json', 'utf8', function(err, data){
    if(err) throw err;
    let usersArr = JSON.parse(data);

    for(let i = 0; i<usersArr.length; i++){
      if(usersArr[i].name == req.params.name){
        res.json(usersArr[i]);
        return;
      }
    }
    res.sendStatus(400);
  })
});

// Create new user
app.post('/users', function(req, res) {
  fs.readFile("./storage.json", "utf8", function(err, data){
    if(err) throw err;
    let usersArr = JSON.parse(data);

    console.log(req.body);
    usersArr.push(req.body);

    fs.writeFile("./storage.json", JSON.stringify(usersArr), function(err){
      if(err) throw err;

      res.sendStatus(200);

    })

  })
});

// Update one user
app.put('/users/:name', function(req, res) {
  fs.readFile('./storage.json', 'utf8', function(err, data){
    if(err) throw err;
    let usersArr = JSON.parse(data);

    for(let i = 0; i<usersArr.length; i++){
      if(usersArr[i].name == req.params.name){
        usersArr[i] = req.body;

        fs.writeFile('./storage.json', JSON.stringify(usersArr), function(err){
          console.log("success!");
          res.sendStatus(200);
        });
        return;

      }
    }
    res.sendStatus(400);
  })
});

// Delete one user
app.delete('/users/:name', function(req, res) {
  fs.readFile('./storage.json', 'utf8', function(err, data){
    if(err) throw err;
    let usersArr = JSON.parse(data);

    for(let i = 0; i<usersArr.length; i++){
      if(usersArr[i].name == req.params.name){

        usersArr.splice(i, 1);

        fs.writeFile('./storage.json', JSON.stringify(usersArr), function(err){
          console.log("success!");
          res.sendStatus(200);
        });
        return;

      }
    }
    res.sendStatus(400);
  })
});

app.listen(port, function() {
  console.log('Listening on', port);
});
