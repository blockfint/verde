import path from 'path';
import express from 'express';

import GreenBoxAPI from '../../greenBoxApi';

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../web_files/index.html'));
});

router.post('/verifyIdentity', (req, res) => {
  GreenBoxAPI.requestAuthen();
});

export default router;