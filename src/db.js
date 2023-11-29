const { MongoClient, ObjectId } = require('mongodb');


// MongoDB setup
const url = 'mongodb+srv://swade:iam@cluster0.ig7di0j.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URL
const dbName = 'quackdb'; // Your database name
const client = new MongoClient(url);


// Define your functions (login, makePost, etc.)

// MongoDB setup
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (e) {
    console.error(e);
  }
}

// const bcrypt = require('bcrypt');

async function registerUser(username, email, password) {
  // ... other code
  const usersCollection = client.db("quackdb").collection("users");
  const result = await usersCollection.insertOne({ username, email, password }); // Storing the password directly
  return result.insertedId; // Return the insertedId if registration is successful
}



connectDB();

// Login function
async function loginUser(email, password) {
  const usersCollection = client.db("quackdb").collection("users");
  const user = await usersCollection.findOne({ email });

  if (user && user.password === password) {
    return user; // User found and password matches
  } else {
    return null; // User not found or password does not match
  }
}



// Make Post function
async function addNewQuack(quack) {
  const quacksCollection = client.db("quackdb").collection("quacks");
  await quacksCollection.insertOne(quack);
  return getAllQuacks();
}

// Get All Quacks function
async function getAllQuacks() {
  const quacksCollection = client.db("quackdb").collection("quacks");
  const quacks = await quacksCollection.find({}).toArray();
  return quacks;
}

// Get Top 5 Quacks function
async function getTopFiveQuacks() {
  const quacksCollection = client.db("quackdb").collection("quacks");
  const topQuacks = await quacksCollection.find({}).sort({ likeCount: -1 }).limit(5).toArray();
  return topQuacks;
}



// Delete Post function
async function deletePost(quackId) {
  const quacksCollection = client.db("quackdb").collection("quacks");
  await quacksCollection.deleteOne({ _id: new ObjectId(quackId) });
  return getAllQuacks();
}

// Increment Likes function
async function incrementLikes(quackId) {
  const quacksCollection = client.db("quackdb").collection("quacks");
  await quacksCollection.updateOne({ _id: new ObjectId(quackId) }, { $inc: { likeCount: 1 } });
  return quacksCollection.findOne({ _id: new ObjectId(quackId) });
}

// Add Comment function
async function addComment(quackId, comment) {
  const quacksCollection = client.db("quackdb").collection("quacks");
  await quacksCollection.updateOne({ _id: new ObjectId(quackId) }, { $push: { comments: comment } });
  return quacksCollection.findOne({ _id: new ObjectId(quackId) });
}

// Expose functions for use in your application
module.exports = {
  loginUser,
  addNewQuack,
  getAllQuacks,
  getTopFiveQuacks,
  deletePost,
  incrementLikes,
  addComment,
  registerUser
};