import express from 'express';
import cors from 'cors';
import authService from './service/auth.service.js';
import produtosRoutes from './routes/produtos.route.js';


const app = express();
app.use(cors());
app.use(express.json());


const PORT = 3000;
app.use('/api/produtos', produtosRoutes);


app.post('/api/login', async (req, res) => {
  try {
    const usuario = await authService.validarLogin(req.body.email, req.body.senha);
    res.json({ message: 'Sucesso', usuario });
  } catch (err) {
    if (err.message === 'OBRIGATORIO') return res.status(400).json({ error: 'email ou senha obrigatório' });
    if (err.message === 'INCORRETA') return res.status(401).json({ error: 'email ou senha incorreta' });
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/perfil', async (req, res) => {
  try {
    const dados = await authService.buscarDadosPerfil(req.query.usuario_id);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
    console.log(`CoffeeHouse rodando em: http://localhost:${PORT}`);
});




