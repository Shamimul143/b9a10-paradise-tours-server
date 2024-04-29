const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASS}@cluster0.tgeue7q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const paradiceToursCollection = client.db('paradiceToursDB').collection('paradiceTours');

        app.get('/paradiceTours', async (req, res) => {
            const cursor = paradiceToursCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.post('/paradiceTours', async (req, res) => {
            const addedSpot = req.body;
            console.log(addedSpot);
            const result = await paradiceToursCollection.insertOne(addedSpot);
            res.send(result);
        })

        app.get('/paradiceTours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await paradiceToursCollection.findOne(query);
            res.send(result);
        })


        app.get('/myItem/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await paradiceToursCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        }) 

        app.put('/paradiceTours/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedSpot = req.body;
            const spotItems = {
                $set: {
                    imageUrl: updatedSpot.imageUrl,
                    touristsSpotName: updatedSpot.touristsSpotName,
                    countryName: updatedSpot.countryName,
                    location: updatedSpot.location,
                    averageCost: updatedSpot.averageCost,
                    totaVisitorsPerYear: updatedSpot.totaVisitorsPerYear,
                    travelTime: updatedSpot.travelTime,
                    seasonality: updatedSpot.seasonality,
                    shortDescription: updatedSpot.shortDescription

                }
            }
            const result = await paradiceToursCollection.updateOne(filter, spotItems, options);
            res.send(result);
        })


        app.delete('/paradiceTours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await paradiceToursCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`paradise ture is running on port, ${port}`);
})