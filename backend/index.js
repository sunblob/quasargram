const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(morgan('dev'));

const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'HI',
  });
});

app.get('/posts', async (req, res) => {
  const posts = [];
  try {
    const snapshot = await db
      .collection('posts')
      .orderBy('date', 'desc')
      .get();
    snapshot.forEach((doc) => {
      posts.push(doc.data());
    });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
