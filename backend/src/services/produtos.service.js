import db from '../db.js';


class ProdutosService {
  async listar(categoria, pagina) {
    const pg = parseInt(pagina) || 1;
    const offset = (pg - 1) * 4;


    let query = `SELECT p.id, p.nome, p.categoria, p.preco::float, p.tempo_preparo::text, p.emoji,
                 (SELECT COUNT(*)::int FROM public.curtidas WHERE produto_id = p.id) AS likes,
                 (SELECT COUNT(*)::int FROM public.comentarios WHERE produto_id = p.id) AS comentarios FROM public.produtos p`;


    const params = [];
    if (categoria) { query += ' WHERE p.categoria = $1'; params.push(categoria); }


    query += ` ORDER BY p.id LIMIT 4 OFFSET $${params.length + 1}`;
    params.push(offset);


    const { rows } = await db.query(query, params);
    return rows;
  }


  async alternarLike(usuario_id, produto_id) {
    const verif = await db.query('SELECT id FROM public.curtidas WHERE usuario_id = $1 AND produto_id = $2', [usuario_id, produto_id]);
    if (verif.rows.length > 0) {
      await db.query('DELETE FROM public.curtidas WHERE usuario_id = $1 AND produto_id = $2', [usuario_id, produto_id]);
      return { curtido: false };
    }
    await db.query('INSERT INTO public.curtidas (usuario_id, produto_id) VALUES ($1, $2)', [usuario_id, produto_id]);
    return { curtido: true };
  }


  async adicionarComentario(usuario_id, produto_id, texto) {
    if (!texto || texto.trim().length <= 2) throw new Error('VALIDACAO_TEXTO');
    const { rows } = await db.query('INSERT INTO public.comentarios (usuario_id, produto_id, texto_comentario) VALUES ($1, $2, $3) RETURNING *', [usuario_id, produto_id, texto]);
    return rows;
  }
}


export default new ProdutosService();




