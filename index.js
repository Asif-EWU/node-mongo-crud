const express = require('express');
// const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://asif:asifratul@cluster0.efdix.mongodb.net/myDatabase?retryWrites=true&w=majority";

const app = express();
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/bro', (req, res) => {
    res.send('Yoo Bro !!');
})

app.get('/', (req, res) => {
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

    app.get('/product/:id', (req, res) => {
        db.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        
        db.insertOne(product)
            .then(result => {
                console.log("data added successfully");
                res.redirect('/');
            })
    })    

    app.patch('/update/:id', (req, res) => {
        db.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {price: req.body.price, quantity: req.body.quantity}
        })
        .then(result => {
            console.log(result);
            res.send(result.modifiedCount > 0);
        })
    })

    app.delete('/delete/:id', (req, res) => {
        db.deleteOne({_id: ObjectId(req.params.id)})
            .then(result => {
                console.log(result);
                res.send(result.deletedCount > 0);
            })
    })
});


app.listen(3000);