import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const router = Router();

router.post('/api/openai', async (req, res) => {
    try {
      const openai = req.app.locals.openai;
  
      const PREPROMPT = `
  Você é um assistente médico.
  Analise os sintomas informados e forneça uma resposta objetiva.
  `;
  
      const payload = req.body;
  
      var payloadText = Object.entries(payload)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' -- ');
        console.log(payloadText)
      const response = await openai.responses.create({
        model: 'gpt-5',
        input: [
          {
            role: 'system',
            content: PREPROMPT,
          },
          {
            role: 'user',
            content: payloadText,
          },
        ],
      });
  
      res.json({
        output: response.output_text,
      });
    } catch (error) {
      console.error(error);
      res.status(200).json({
        error: 'Failed to generate response',
        payload: payloadText,
      });
    }
  });

router.post('/chat', async (req, res) => {
  try {
    const openai = req.app.locals.openai;
    const { message } = req.body;

    const response = await openai.responses.create({
      model: 'gpt-5',
      input: message,
    });

    res.json({
      output: response.output_text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to generate response',
    });
  }
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Triagem.html'));  });

export default router;