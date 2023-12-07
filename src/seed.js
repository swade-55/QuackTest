const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://swade:iam@cluster0.ig7di0j.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'quackdb';

async function seedDB() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db(dbName);

    const quacks = Array.from({ length: 20 }, (v, i) => ({
      name: `Quack ${i + 1}`,
      postContent: `Content of quack ${i + 1}.`,
      likeCount: Math.floor(Math.random() * 100), 
      comments: [
      ]
    }));

    // Inserting quacks into the collection
    const quacksCollection = db.collection("quacks");
    await quacksCollection.deleteMany({}); // Clear existing quacks
    await quacksCollection.insertMany(quacks);
    console.log("Quacks collection seeded with 20 quacks");

  } catch (e) {
    console.error("Error during database seed:", e);
  } finally {
    await client.close();
  }
}

seedDB();
