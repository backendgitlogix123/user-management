const express = require("express");
const mongodb = require("mongodb");

const assert = require("assert");
const Router = express.Router();
const app = express();

const url = "mongodb://umar:123456789@localhost:27017/mypeople"; // First start mongodb: mongo.exe mongodb://localhost:27017/mypeople on c:\\mongoDB\bin

app.get('/', (req,res) => {
    res.send("API is running fine!");
});

app.get('/health', (req,res) => {
    res.send("API health is 100%");
});

var database;
mongodb.connect(url, (err, db) => {
    if (err){
        console.log("Can not connect!");
    }
    else{
        console.log("I'm connected");
        database = db;
    }
});            

app.get('/insert', (req, res) => {
    var item = {
        title: "umar",
        body: "A man of Allah"
    }
    database.collection("users").insertOne(item, function(err, result){
        assert.equal(null, err);
        console.log(result);
        res.send("Data is inserted");
    })
});

app.get('/selectFirst/', (req, res) => {
    database.collection("users").findOne({}, function(err, result) {
        if (err) throw err;
        res.send(result);
      });
});

app.get('/select/:id', (req, res) => {
    var o_id = new mongodb.ObjectID(req.params.id);
    database.collection("users").findOne({_id: o_id}, function(err, result) {
        if (err) throw err;

        if (result === null){
            res.send("Couldn't find user with ID = "+ o_id);
        }
        else{
            console.log(result);
            res.send(result);
        }
      });
});


const port = 4010;
app.listen(port, () => {
    console.log(`Server is listening on Port ${port}`);
});