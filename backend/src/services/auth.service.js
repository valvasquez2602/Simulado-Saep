import db from '../db.js';


class AuthService {
  async validarLogin(email, senha) {
    if (!email || !senha) throw new Error('OBRIGATORIO');
   
    const query = 'SELECT id, nome, email FROM usuarios WHERE email = $1 AND senha = $2';
    const { rows } = await db.query(query, [email, senha]);
   
    if (rows.length === 0) throw new Error('INCORRETA');
    return rows;
  }


  async buscarDadosPerfil(usuarioId) {
    const queryGeral = 'SELECT COUNT(*)::int AS total_pedidos_empresa, COALESCE(SUM(quantidade * p.preco), 0)::float AS valor_total_empresa FROM pedidos pd INNER JOIN produtos p ON pd.produto_id = p.id';
    const queryUsuario = 'SELECT nome (SELECT COUNT(*)::int FROM pedidos WHERE usuario_id = $1) AS total_pedidos_usuario FROM usuarios WHERE id = $1';
   
    const dadosGeral = await db.query(queryGeral);
    const dadosUsuario = await db.query(queryUsuario, [usuarioId]);


    return { empresa: dadosGeral.rows, usuario: dadosUsuario.rows };
  }
}


export default new AuthService();





