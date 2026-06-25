const DB_CHAVE_PRODUTOS = "coffeehouse_produtos_db";
const DB_CHAVE_EMPRESA = "coffeehouse_empresa_db";

const dadosEmpresaIniciais = {
    nome: "CoffeeHouse Premium",
    logo: "CoffeeHouse.png",
    totalPedidos: 1240,
    totalCompras: 45890.50
};

const produtosIniciais = [
    { id: 1, nome: "Espresso Tradicional", categoria: "café", qtd: "200ml", tempo: "5 min", preco: "R$ 6,00", likes: 45, comentarios: 12, icone: "cafe.png" },
    { id: 2, nome: "Cappuccino Italiano", categoria: "café", qtd: "300ml", tempo: "7 min", preco: "R$ 11,00", likes: 89, comentarios: 34, icone: "cappuccino.png" },
    { id: 3, nome: "Croissant de Queijo", categoria: "Lanches", qtd: "1 un", tempo: "10 min", preco: "R$ 9,50", likes: 32, comentarios: 8, icone: "croissant.png" },
    { id: 4, nome: "Muffin de Chocolate", categoria: "Sobremesas", qtd: "1 un", tempo: "4 min", preco: "R$ 8,00", likes: 112, comentarios: 56, icone: "muffin.png" },
    { id: 5, nome: "Latte Macchiato", categoria: "café", qtd: "350ml", tempo: "6 min", preco: "R$ 12,50", likes: 67, comentarios: 19, icone: "latte.png" },
    { id: 6, nome: "Misto Quente Especial", categoria: "Lanches", qtd: "1 un", tempo: "8 min", preco: "R$ 14,00", likes: 23, comentarios: 4, icone: "misto.png" },
    { id: 7, nome: "Cheesecake de Frutas Vermelhas", categoria: "Sobremesas", qtd: "1 fatia", tempo: "5 min", preco: "R$ 16,00", likes: 154, comentarios: 72, icone: "cheesecake.png" }
];

if (!localStorage.getItem(DB_CHAVE_EMPRESA)) {
    localStorage.setItem(DB_CHAVE_EMPRESA, JSON.stringify(dadosEmpresaIniciais));
}
if (!localStorage.getItem(DB_CHAVE_PRODUTOS)) {
    localStorage.setItem(DB_CHAVE_PRODUTOS, JSON.stringify(produtosIniciais));
}

let usuarioLogado = false; 
let filtroAtual = "todos";
let paginaAtual = 1;
const itensPorPagina = 4; 

const elLogo = document.getElementById("empresa-logo");
const elNome = document.getElementById("empresa-nome");
const elTotalPedidos = document.getElementById("total-pedidos");
const elTotalCompras = document.getElementById("total-compras");
const elListaProdutos = document.getElementById("lista-produtos");
const elPaginacao = document.getElementById("paginacao");
const elBtnLogin = document.getElementById("btn-login");
const elBtnSair = document.getElementById("btn-sair");
const elStatusUsuario = document.getElementById("status-usuario");
const modalLogin = document.getElementById("modal-login");

function carregarPerfilEmpresa() {
    const empresa = JSON.parse(localStorage.getItem(DB_CHAVE_EMPRESA));
    elLogo.src = empresa.logo;
    elNome.textContent = empresa.nome;
    elTotalPedidos.textContent = empresa.totalPedidos;
    elTotalCompras.textContent = `R$ ${empresa.totalCompras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function renderizarVitrine() {
    const produtos = JSON.parse(localStorage.getItem(DB_CHAVE_PRODUTOS));
    
    const produtosFiltrados = produtos.filter(p => {
        return filtroAtual === "todos" || p.categoria.toLowerCase() === filtroAtual.toLowerCase();
    });

    const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina) || 1;
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const indiceInicio = (paginaAtual - 1) * itensPorPagina;
    const produtosPaginados = produtosFiltrados.slice(indiceInicio, indiceInicio + itensPorPagina);

    elListaProdutos.innerHTML = "";
    produtosPaginados.forEach(prod => {
        const card = document.createElement("div");
        card.className = "produto-card";
        card.innerHTML = `
            <div class="produto-header">
                <img src="${prod.icone}" alt="${prod.nome}" class="produto-icone">
                <div class="produto-titulo">${prod.nome}</div>
            </div>
            <div class="produto-detalhes">
                <p><strong>Qtd:</strong> ${prod.qtd}</p>
                <p><strong>Tempo:</strong> ${prod.tempo}</p>
                <p><strong>Preço:</strong> ${prod.preco}</p>
            </div>
            <div class="produto-interacoes">
                <div class="interacao-item" onclick="interagirProduto(${prod.id}, 'like')">
                    <img src="coração.svg" alt="Like" class="icone-interacao">
                    <span>${prod.likes}</span>
                </div>
                <div class="interacao-item" onclick="interagirProduto(${prod.id}, 'comentario')">
                    <img src="comentário.svg" alt="Comentário" class="icone-interacao">
                    <span>${prod.comentarios}</span>
                </div>
            </div>
        `;
        elListaProdutos.appendChild(card);
    });

    elPaginacao.innerHTML = "";
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement("button");
        btn.className = `btn-page ${i === paginaAtual ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => mudarPagina(i);
        elPaginacao.appendChild(btn);
    }
}

function verificarAcesso() {
    if (!usuarioLogado) {
        modalLogin.style.display = "flex";
        return false;
    }
    return true;
}

function mudarPagina(numeroPagina) {
    if (!verificarAcesso()) return;
    paginaAtual = numeroPagina;
    renderizarVitrine();
}

function interagirProduto(id, tipo) {
    if (!verificarAcesso()) return;

    const produtos = JSON.parse(localStorage.getItem(DB_CHAVE_PRODUTOS));
    const indice = produtos.findIndex(p => p.id === id);

    if (indice !== -1) {
        if (tipo === 'like') produtos[indice].likes++;
        if (tipo === 'comentario') produtos[indice].comentarios++;
        
        localStorage.setItem(DB_CHAVE_PRODUTOS, JSON.stringify(produtos));
        renderizarVitrine();
    }
}

document.querySelectorAll(".btn-filtro").forEach(botao => {
    botao.addEventListener("click", (e) => {
        if (!verificarAcesso()) return;
        
        document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        
        filtroAtual = e.target.getAttribute("data-categoria");
        paginaAtual = 1; // Reseta para a primeira página no filtro
        renderizarVitrine();
    });
});

elBtnLogin.addEventListener("click", () => {
    modalLogin.style.display = "flex";
});

document.getElementById("btn-simular-login").addEventListener("click", () => {
    usuarioLogado = true;
    elStatusUsuario.textContent = "Usuário Conectado";
    elStatusUsuario.style.color = "#2e7d32";
    modalLogin.style.display = "none";
});

document.getElementById("btn-fechar-modal").addEventListener("click", () => {
    modalLogin.style.display = "none";
});

elBtnSair.addEventListener("click", () => {
    usuarioLogado = false;
    elStatusUsuario.textContent = "Modo Visitante (Funcionalidades Desabilitadas)";
    elStatusUsuario.style.color = "#777";
    paginaAtual = 1;
    filtroAtual = "todos";
    
    document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("active"));
    document.querySelector("[data-categoria='todos']").classList.add("active");
    
    renderizarVitrine();
});

carregarPerfilEmpresa();
renderizarVitrine();