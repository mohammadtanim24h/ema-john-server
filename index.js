const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
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
