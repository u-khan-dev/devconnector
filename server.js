import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import users from './routes/api/users.js';
import auth from './routes/api/auth.js';
import profile from './routes/api/profile.js';
import posts from './routes/api/posts.js';
import path from 'path';

dotenv.config();

const app = express();

connectDB();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/profile', profile);
app.use('/api/v1/posts', posts);

// serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started on port ${port}`));
