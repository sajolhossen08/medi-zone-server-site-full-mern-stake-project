const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5050;
console.log(process.env.DB_USER);

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i6omw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err);
  const productCollection = client.db("mediZone").collection("product");

  app.get('/product', (req, res) => {
    productCollection.find()
    .toArray((err, item) => {
      res.send(item)
      console.log('from database', item)
    })
  })

  app.post('/addProduct', (req, res) =>{
    const newProduct = req.body;
    console.log('Adding new Product: ', newProduct)
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })
  
  console.log('Database connected successfully')
});


app.listen(port);