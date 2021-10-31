const express = require('express')
const app = express()
var cors = require('cors')

const port = process.env.PORT || 5000
const { MongoClient } = require('mongodb');
require('dotenv').config()
app.use(cors())


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.rn4ua.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run (){

  try{
      // connection
      await client.connect() 
      const db =  client.db(process.env.DB_NAME);
      const tourCollection =  db.collection("tours");
      console.log("connnection successfull")
      
      // index 

      app.get('/tours', async (req,res) => {
          
          const limit = parseInt(req.query.size)
          const pageNumber = parseInt(req.query.page)
          console.log("limit - pageNumber", limit, pageNumber)
          const query = {}
          const options = { 
              skip: pageNumber*limit || 0, 
              limit: limit || 0
          }
          const count = await tourCollection.estimatedDocumentCount();
          
          // const count = await cursor.count();
          const cursor = tourCollection.find(query, options)
          
          const products = await cursor.toArray()
          if(pageNumber){
              
          }
          else{

          }
          res.json({
              count: count,
              products: products,
              
          })
      })
      

      // store 
      app.get('/tour',async (req,res)=> {
        const doc = {
          title: "AMAZON CRUISE",
          img: "http://cdn-adventure-tours.themedelight.com/wp-content/uploads/2015/07/tropical-rainforest-parrot.jpg",
          price: 200,
          location: "Amazon, Brazil", 
          duration: 7, 
          rating: 5, 
          description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, reiciendis? Quis in facilis et iusto libero eum, doloribus, vitae expedita eos, ipsam suscipit quas accusantium repellendus accusamus voluptatibus pariatur blanditiis fugiat velit. Dolores magnam optio quidem saepe maxime iusto temporibus? Ab sit ipsa voluptates autem aperiam temporibus libero earum aspernatur aliquid dolores quidem, provident, non rem commodi eum assumenda voluptatem quia! Distinctio non excepturi ipsa voluptatibus inventore sapiente necessitatibus? Reprehenderit in nemo at! Sint quibusdam nulla et accusantium delectus perferendis repellendus eveniet nihil enim sunt nesciunt, illum repudiandae magni veritatis numquam omnis voluptates impedit possimus, adipisci neque fugit perspiciatis officia aliquam cupiditate? Necessitatibus suscipit sequi eaque labore velit sunt possimus maxime sit recusandae incidunt fugit aliquam, eligendi, commodi nihil itaque corrupti minus hic. Quo ullam nulla non minus nisi laborum quod eius, at a tempore nesciunt accusantium animi officia tenetur magnam dolores temporibus! Officiis, nobis animi hic fuga adipisci repellendus eum ex suscipit quam porro cupiditate, magni eos dolorem ab debitis sit doloribus sequi at quisquam accusantium ut illo. Ab consectetur, ducimus adipisci doloribus sed laborum. Voluptatibus at illum expedita culpa eligendi molestias, excepturi labore voluptatem corporis, dolorem dignissimos! Unde, ipsa tempore labore delectus beatae minus ullam magni mollitia quibusdam!"
        }
        const result = await tourCollection.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.send(result.insertedId)

      })
      // find
      app.get("/product/:id", async (req,res) => {
          const id = req.params.id
          res.send(id)
      })
      

  }
  finally{
      console.log("connection alive")
      // client.close()
      // console.log("Connection closed ")
  }

}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


