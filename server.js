var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var port = process.env.PORT || 8000;
app.use(bodyParser.json({ extended: true }));


function readToJson(filePath){
  return new Promise((resolve, reject)=>{
    fs.readFile(filePath, 'utf8', (err, data)=>{
      if(err){
        reject(err);
      }else{
        resolve(JSON.parse(data));
      }
    });
  });
}

function writeToJson(filePath, obj){

  return new Promise((resolve, reject)=>{
    fs.writeFile(filePath, JSON.stringify(obj), function(err){
      if(err){
        reject(err);
      }else{
        resolve();
      }
    })
  })
}

// CRUD
// create read update delete (destroy)

// Get all users
app.get('/users', function(req, res) {
  readToJson("./storage.json").then((usersArr)=>{
    res.json(usersArr);
  })
  .catch((err)=>{
    console.error(err);
  })
});

// Get one user
app.get('/users/:name', function(req, res) {
  readToJson("./storage.json").then((usersArr)=>{
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
  readToJson('./storage.json').then((usersArr)=>{
    usersArr.push(req.body);

    writeToJson("./storage.json", usersArr).then(()=>{
      res.sendStatus(200);
    })
    .catch((err)=>{
      console.error(err);
      res.sendStatus(400);
    })

  })
});

// Update one user
app.put('/users/:name', function(req, res) {
  readToJson("./storage.json").then((usersArr)=>{

    for(let i = 0; i<usersArr.length; i++){
      if(usersArr[i].name == req.params.name){
        usersArr[i] = req.body;

        writeToJson('./storage.json', usersArr).then(()=>{
          res.sendStatus(200);
        })
        .catch((err)=>{
          console.error(err);
          res.sendStatus(400);
        })
        return;

      }
    }
    res.sendStatus(400);
  })
});

// Delete one user
app.delete('/users/:name', function(req, res) {
  readToJson("./storage.json").then((usersArr)=>{


    for(let i = 0; i<usersArr.length; i++){
      if(usersArr[i].name == req.params.name){

        usersArr.splice(i, 1);

        writeToJson('./storage.json', usersArr).then(()=>{
          res.sendStatus(200);
        })
        .catch((err)=>{
          console.error(err);
          res.sendStatus(400);
        })
        return;

      }
    }
    res.sendStatus(400);
  })
});

app.listen(port, function() {
  console.log('Listening on', port);
});
