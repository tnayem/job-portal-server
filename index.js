const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())

console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.etjzxzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    await client.connect();
    // create collections 
    const jobsCollection = client.db("job-portal").collection("jobs")
    const applicationCollection = client.db("job-portal").collection("applications")

    // Get Data from database
    app.get('/jobs', async(req,res)=>{
      const result = await jobsCollection.find().toArray()
      res.send(result)
    })
    // Specific Job data 
    app.get('/jobs/:id',async(req,res)=>{
      const id = req.params.id 
      const cursor = {_id : new ObjectId(id)}
      const result = await jobsCollection.findOne(cursor)
      res.send(result)
    })
    // Application 
    app.post('/application', async(req,res)=>{
      const application = req.body; 
      const result = await applicationCollection.insertOne(application)
      res.send(result)
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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
