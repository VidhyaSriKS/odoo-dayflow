import { Router } from 'express';

const router = Router();

router.post('/chat', (req, res) => {
  res.json({
    response: `This is a mock AI response from the Node.js backend to your query: "${req.body.prompt}"`,
    dataSource: 'Dayflow Node Engine',
    suggestedActions: ['View Dashboard']
  });
});

router.get('/insights', (req, res) => {
  res.json([]);
});

export default router;
