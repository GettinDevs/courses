import express from 'express';
import cors from 'cors'

import { config } from '@config';
import { routes } from '@/routes';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api', routes);

app.listen(config.app.port, () => {
  console.log(`Server listening on port ${config.app.port}`);
})