const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// emaJohnDb
// DUBID3BIfnf5bZga


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j7ixx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("emaJohn").collection("product");

        app.get("/product", async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if(page || size) {
                // page = 0 --> skip: 0, get 0-10;
                // page = 1 --> skip: 1*10(suppose size is 10), get 11-20;
                // page = 2 --> skip: 2*10(suppose size is 10), get 21-30;
                // page = 3 --> skip: 3*10(suppose size is 10), get 31-40;
                // joto no. page e asi oitar sathe size multiply hoibo and totogula skip hoibo. page 0 te ami first page e tai kichu skip hoibo na and ami 0-10 datagula pabo. tarpor page 1 hoileo ami ashole 2nd page e asi. karon page 0 first page chilo. tai page 1 e ami 10 ta data skip korbo jeigula ager page e dekhano hoise and 11-20 porjonto data pabo. tarpor page 2 hoileo ami ashole 3 no. page e asi tai prothom 20 ta data skip korbo jeigula ager page gulate dekhano hoise and 21-30 porjonto data pabo. size 10 dhore ei hishab ta kora hoise.
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }
            res.send(products);
        })

        app.get("/productCount", async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({count})
        })

        // use post to get products by ids.
        app.post("/productsByKeys", async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            console.log(ids);
            const query = {_id: {$in: ids}}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            console.log(products);
            res.send(products);
        })
    }
    finally {

    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Ema John is up and running!");
});

app.listen(port, () => {
    console.log('Listening to port', port);
})
