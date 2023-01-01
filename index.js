const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kjb9ctc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const aboutCollection = client.db('SocailProjects').collection('aboutOption');
        const postCollection = client.db('SocailProjects').collection('PostOption');

        app.get('/about/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await aboutCollection.findOne(query);
            res.send(user)
        });

        app.post('/about', async (req, res) => {
            const query = req.body
            const result = await aboutCollection.insertOne(query)
            res.send(result)
        });

        app.put('/about/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const user = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                    u: user.u,
                    address: user.address,
                }
            }
            const result = await aboutCollection.updateOne(filter, updatedUser, option);
            res.send(result)
        });


        //post api control here
        app.get('/posts', async(req,res)=>{
            const query = {};
            const result = await postCollection.find().toArray();
            res.send(result);
        })
        app.post('/posts', async (req, res) => {
            const query = req.body;
            const result = await postCollection.insertOne(query);
            res.send(result);
        });


    }
    finally {

    }
}
run().catch(console.log);




app.get('/', async (req, res) => {
    res.send('Socail Projects server is Running')
})

app.listen(port, () => console.log(`Socail Projects server running on ${port}`))