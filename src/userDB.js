const { MongoClient, ObjectId } = require('mongodb');


// MongoDB setup
const url = 'mongodb+srv://swade:iam@cluster0.ig7di0j.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'userdb'; // Your database name
const client = new MongoClient(url);


connectDB();

// MongoDB setup
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (e) {
    console.error(e);
  }
}

async function registerUser(username, email, password, id) {
  console.log("saving: " + email + ", " + password);
  const usersCollection = client.db("userdb").collection("users");
  const result = await usersCollection.insertOne({ username, email, password, id });
  return result.insertedId; 
}

// Login function
async function loginUser(email, password) {
  console.log("logging in: " + email + ", " + password);
  const usersCollection = client.db("userdb").collection("users");
  const user = await usersCollection.findOne({ email });

  if (user && user.password === password) {
    return user; 
  } else {
    return null;
  }
}

module.exports = {
  loginUser,
  registerUser
};