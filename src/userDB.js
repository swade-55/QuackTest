const { MongoClient, ObjectId } = require('mongodb');


// MongoDB setup
const url = 'mongodb+srv://swade:iam@cluster0.ig7di0j.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URL
const dbName = 'userdb'; // Your database name
const client = new MongoClient(url);


connectDB();
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

async function registerUser(username, email, password, id) {
  // ... other code
  console.log("saving: " + email + ", " + password);
  const usersCollection = client.db("userdb").collection("users");
  const result = await usersCollection.insertOne({ username, email, password, id }); // Storing the password directly
  return result.insertedId; // Return the insertedId if registration is successful
}

// Login function
async function loginUser(email, password) {
  console.log("logging in: " + email + ", " + password);
  const usersCollection = client.db("userdb").collection("users");
  const user = await usersCollection.findOne({ email });

  if (user && user.password === password) {
    return user; // User found and password matches
  } else {
    return null; // User not found or password does not match
  }
}

// Expose functions for use in your application
module.exports = {
  loginUser,
  registerUser
};