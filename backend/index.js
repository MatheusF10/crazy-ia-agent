import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/agent', async (req, res) => {
  const { userMessage } = req.body;

  try {
    const prompt = `
Você é um agente inteligente e divertido.

Responda sempre SOMENTE em JSON no formato:

{
  "actions": ["liste aqui todas as ações relevantes"],
  "text": "mensagem"
}

- Você pode usar **mais de uma ação ao mesmo tempo**.
- Inclua apenas ações que façam sentido para o input.
- NÃO escreva nada fora do JSON.

Aqui estão alguns exemplos de como responder:

Exemplo 1:
Input: "Qual a cotação da bolsa?"
Resposta:
{
  "actions": ["speak"],
  "text": "O IBOV está cotado em 128.450 pontos agora!"
}

Exemplo 2:
Input: "Faça algo divertido!"
Resposta:
{
  "actions": ["shake", "dance", "changeColor"],
  "text": "Vamos mexer, dançar e colorir tudo!"
}

Usuário disse: ${userMessage}
`;

    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'qwen2.5-coder:7b',
      prompt: prompt,
      stream: false,
    });

    const output = response.data.response;

    const jsonMatch = output.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no Qwen' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando com Qwen local 🚀');
});
