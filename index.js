const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://asif:asifratul@cluster0.efdix.mongodb.net/myDatabase?retryWrites=true&w=majority";

const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Yoo Bro !!');
})

app.get('/file', (req, res) => {
    res.sendFile(__dirname + '/myFile.html');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if (err) {
        console.log("Error is ---> ", err);
        return;
    }

    const db = client.db("myDatabase").collection("products");

    app.get('/products', (req, res) => {
        db.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        
        db.insertOne(product)
            .then(result => {
                console.log("data added successfully");
                res.send('success');
            })
    })    




    // const product = {
    //     name: "laptop",
    //     price: 420,
    //     quantity: 10
    // };

    // collection.insertOne(product)
    //     .then(res => console.log("one product added"));

    // console.log("Database connected");
});


app.listen(3000);