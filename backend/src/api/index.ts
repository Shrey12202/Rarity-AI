import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import prompt from './prompt';
import generate from './generate';
import mint from './mint';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/prompt', prompt);
router.use('/generate', generate);
router.use('/mint', mint);

export default router;
