const express = require('express')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();

const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());


//db user= tourisom
//db pass =O60ChBn4ZusWlhxz

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.teo92.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();

        const database = client.db('tourism');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        // get data from database
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //get single servicess
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('get id', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })
        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);

        });

        //post api for add order
        app.post('/orders', async (req, res) => {

            console.log('hit the post api');

            const orders = req.body;
            console.log(orders);


            const result = await orderCollection.insertOne(orders);
            console.log(result);
            res.json(result);


        });
        //get api for my order 
        // app.get('/orders/:email', async (req, res) => {

        //     const em = req.params.email;
        //     if (em) {
        //         console.log('get email', em);
        //         const query = { email: em };
        //         const order = await orderCollection.find(query).toArray();
        //         res.json(order);
        //     }
        // })
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })


        //DELETE API
        app.delete('/orders/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);

        })
        //DELETE API of services
        app.delete('/services/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        })







        console.log('connected to database');


    }




    finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})