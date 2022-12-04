import express from 'express';
import cors from 'cors'

import { config } from './config';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.app.port, () => {
  console.log(`Server listening on port ${config.app.port}`);
})