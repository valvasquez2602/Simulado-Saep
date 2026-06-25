import express from 'express';
import produtosService from '../service/produtos.service.js';


const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const produtos = await produtosService.listar(req.query.categoria, req.query.pagina);
    res.json(produtos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


router.post('/like', async (req, res) => {
  try {
    const resultado = await produtosService.alternarLike(req.body.usuario_id, req.body.produto_id);
    res.json(resultado);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


router.post('/comentario', async (req, res) => {
  try {
    const comentario = await produtosService.adicionarComentario(req.body.usuario_id, req.body.produto_id, req.body.texto_comentario);
    res.status(201).json(comentario);
  } catch (err) {
    if (err.message === 'VALIDACAO_TEXTO') return res.status(400).json({ error: 'O comentário precisa ter mais que 2 caracteres' });
    res.status(500).json({ error: err.message });
  }
});


export default router;


