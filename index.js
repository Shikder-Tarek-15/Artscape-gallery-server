const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

// MongoDB

const uri = `mongodb+srv://${process.env.AG_USER}:${process.env.AG_PASSWORD}@cluster0.rtcbpiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("craftDB");
const craftCollection = database.collection("craftCollection");
const categoryCollection = database.collection("categoryCollection");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // await categoryCollection.insertMany([
    //   {
    //     subcategory_name: "Landscape Painting",
    //     image: "https://i.ibb.co/WGJGPnz/landscape-painting.jpg",
    //     difficulty: "Intermediate",
    //     description: "Capture the beauty of natural landscapes on canvas.",
    //     materials: ["Canvas", "Oil paints", "Paintbrushes"],
    //   },
    //   {
    //     subcategory_name: "Portrait Drawing",
    //     image: "https://i.ibb.co/1GGVYt8/portrait-drawing.jpg",
    //     difficulty: "Beginner to Advanced",
    //     description:
    //       "Create detailed portraits using various drawing techniques.",
    //     materials: ["Drawing paper", "Pencils", "Ink", "Acrylic paints"],
    //   },
    //   {
    //     subcategory_name: "Watercolour Painting",
    //     image: "https://i.ibb.co/fC5cjst/water-color-paint.webp",
    //     difficulty: "Beginner to Intermediate",
    //     description:
    //       "Explore the transparency and fluidity of watercolor paints.",
    //     materials: ["Watercolor paper", "Watercolor paints", "Paintbrushes"],
    //   },
    //   {
    //     subcategory_name: "Oil Painting",
    //     image: "https://i.ibb.co/bd76k0y/oil-paint.jpg",
    //     difficulty: "Intermediate to Advanced",
    //     description: "Create rich and vibrant artworks with oil paints.",
    //     materials: ["Canvas", "Oil paints", "Palette knives", "Turpentine"],
    //   },
    //   {
    //     subcategory_name: "Charcoal Sketching",
    //     image: "https://i.ibb.co/Ld5fQc7/carosel-art.jpg",
    //     difficulty: "Beginner to Intermediate",
    //     description: "Master the art of expressive sketching with charcoal.",
    //     materials: ["Drawing paper", "Charcoal sticks", "Kneaded eraser"],
    //   },
    //   {
    //     subcategory_name: "Cartoon Drawing",
    //     image: "https://i.ibb.co/2F3mLDz/cartoon.jpg",
    //     difficulty: "Beginner to Advanced",
    //     description:
    //       "Create whimsical characters and stories through cartooning.",
    //     materials: ["Drawing paper", "Pencils", "Markers"],
    //   },
    // ]);

    app.post("/craft", async (req, res) => {
      const card = req.body;
      const result = await craftCollection.insertOne(card);
      res.send(result);
    });

    app.get("/allCraft", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/craftDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    app.get("/myCraft/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await craftCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/deleteCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/categoryCard", async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put("/updateCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedCraft = req.body;
      const craft = {
        $set: {
          image: updatedCraft.image,
          item_name: updatedCraft.item_name,
          subcategory_name: updatedCraft.subcategory_name,
          short_description: updatedCraft.short_description,
          processing_time: updatedCraft.processing_time,
          customization: updatedCraft.customization,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          stock_status: updatedCraft.stock_status,
        },
      };
      const result = await craftCollection.updateOne(query, craft);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee server is running");
});
app.listen(port, () => {
  console.log("Server running on port: ", port);
});
