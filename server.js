const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const port = 8000; //3000 (can't POST) | 9000, 5000
// const MONGODB_URI = 'mongodb://localhost:27017'
// const DB_NAME = 'sutrelax'

//use http://localhost:8000/api/user for Postman

app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// User Collection
app.get('/api/user', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('sutrelax');
      const collection = database.collection('user');
      const users = await collection.find({}).toArray();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });

app.post('/api/user', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('sutrelax');
    const collection = database.collection('user');
    const result = await collection.insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

// UserLogin Collection
app.get('/api/userlogin', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('sutrelax');
      const collection = database.collection('userLogin');
      const users = await collection.find({}).toArray();
      res.status(201).json(users);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });

  app.post('/api/userlogin', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('sutrelax');
      const collection = database.collection('userLogin');
      const result = await collection.insertOne(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });

// Article Collection
app.get('/api/article', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('sutrelax');
      const collection = database.collection('article');
      const users = await collection.find({}).toArray();
      res.status(201).json(users);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });

  app.post('/api/article', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('sutrelax');
      const collection = database.collection('article');
      const result = await collection.insertOne(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
