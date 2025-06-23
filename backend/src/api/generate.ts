import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  const { prompt } = req.body;
  // Placeholder logic for image generation
  res.json({
    status: 'success',
    imageUrl: 'https://placehold.co/400x400/png',
    prompt
  });
});

export default router; 