const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const { diskStorage } = require('multer');
const upload = multer({
  storage: diskStorage({
    destination: 'temp/',
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(morgan('dev'));

const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'quasargram-72c80.appspot.com',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

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

app.post('/posts', upload.single('file'), async (req, res) => {
  const file = req.file;
  const post = req.body;
  const uuid = uuidv4();

  try {
    const uploadedResponse = await bucket.upload(file.path, {
      uploadType: 'media',
      metadata: {
        metadata: {
          contentType: file.mimetype,
          firebaseStorageDownloadTokens: uuid,
        },
      },
    });
    await db
      .collection('posts')
      .doc(post.id)
      .set({
        id: post.id,
        caption: post.caption,
        location: post.location,
        date: +post.date,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedResponse[0].name}?alt=media&token=${uuid}`,
      });

    res.status(200).json({
      message: 'Post was successfully created',
    });
  } catch (error) {
    console.log(error);
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
