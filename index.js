const express = require('express')
const app = express()
var cors = require('cors')

const port = process.env.PORT || 5000
const { MongoClient } = require('mongodb');
require('dotenv').config()
app.use(cors())
app.use(express.json())
const { ObjectId } = require('mongodb');
// const _id = ObjectId("4eb6e7e7e9b7f4194e000001");


app.get('/', (req, res) => {
  res.send('Hello World! 2021')
})



const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.rn4ua.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {

  try {
    // connection
    await client.connect()
    const db = client.db(process.env.DB_NAME);
    const tourCollection = db.collection("tours");
    console.log("connnection successfull")

    // index 


    app.get('/tours', async (req, res) => {

      const limit = parseInt(req.query.size)
      const pageNumber = parseInt(req.query.page)
      console.log("limit - pageNumber", limit, pageNumber)
      const query = {}
      const options = {
        skip: pageNumber * limit || 0,
        limit: limit || 0
      }
      const count = await tourCollection.estimatedDocumentCount();

      // const count = await cursor.count();
      const cursor = tourCollection.find(query, options)

      const tours = await cursor.toArray()
      if (pageNumber) {

      }
      else {

      }
      res.json({
        count: count,
        tours: tours,

      })
    })


    // store 
    app.post('/tour', async (req, res) => {
      console.log('inside post req ')
      console.log(req.body, typeof req.body)
      const doc = req.body || {}
      // res.send()
      // return     
      if (doc) {
        const result = await tourCollection.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.send({
          success: true,
          msg: `A document was inserted with the _id: ${result.insertedId}`
        })
      } else {
        res.send(
          {
            success: false,
            msg: `Failed to post`
          }
        )
      }


    })
    // find servier 
    app.post('/tour-details', async (req, res) => {
      console.log('inside tour-details req ')
      console.log(req.body, typeof req.body)
      const doc = req.body || {}
      // res.send()
      // return     
      if (doc) {
        // const result = await tourCollection.insertOne(doc);
        // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        const query = {_id: ObjectId(doc.id) }
        const options= {}
        const cursor = tourCollection.find(query, options);
        const tourDetails = await cursor.toArray()
        res.send({
          success: true,
          msg: `Result Foound`, 
          data: tourDetails
        })
      } else {
        res.send(
          {
            success: false,
            msg: `No serach value found`, 
            data : []
          }
        )
      }


    })
    // find
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id
      res.send(id)
    })

    // delete 


    app.delete('/tour', async (req, res) => {
      console.log('inside delete req ')
      console.log(req.body, typeof req.body)
      const doc = req.body || {}

      // res.send(doc)
      // return   
      const _id = ObjectId(doc.id);
      // Query for a movie that has title "Annie Hall"
      const query = { _id: _id };
      const result = await tourCollection.deleteOne(query);
      console.log("check delete ",result)
      if (result.deletedCount === 1) {
        console.log("delete success")
        res.send({
          success: true,
          msg: "Successfully deleted one document.",
          id: doc.id
        })

       
      } else {
        res.send({
          success: false,
          msg: "Failed to delete",
          id: doc.id
        })
      }

    })
    // delete ./


  }
  finally {
    console.log("connection alive")
    // client.close()
    // console.log("Connection closed ")
  }

}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


