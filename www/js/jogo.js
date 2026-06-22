// ================================
// JOGO PRINCIPAL - JORNADA DA SABEDORIA
// ================================

let faseAtual = "eden";
let perguntaAtualIndex = 0;
let vidas = 3;
let perguntasEmbaralhadas = [];

// ----------------------
// Iniciar jogo
// ----------------------
function iniciarJogo() {
    renderizarMenu();
}

// ----------------------
// Menu principal
// ----------------------
function renderizarMenu() {
    const container = document.getElementById("app");
    clearInterval(timerInterval);

    container.innerHTML = `
        <div style="text-align:center;font-family:sans-serif;padding:20px;">
            <h1>📖 Jornada da Sabedoria</h1>
            <p>Pontuação: ${progresso.pontuacao}</p>

            <button onclick="carregarFase('eden')">Iniciar Jornada</button>
            <button onclick="abrirPerfil()">Perfil</button>
        </div>
    `;
}

// ----------------------
// Carregar fase
// ----------------------
function carregarFase(fase) {
    faseAtual = fase;
    perguntaAtualIndex = 0;
    vidas = 3;

    perguntasEmbaralhadas = [...fases[fase].perguntas]
        .sort(() => Math.random() - 0.5);

    mostrarPergunta();
    iniciarTimer();
}

// ----------------------
// Mostrar pergunta
// ----------------------
function mostrarPergunta() {
    const container = document.getElementById("app");

    if (perguntaAtualIndex >= perguntasEmbaralhadas.length) {
        finalizarFase();
        return;
    }

    const dados = perguntasEmbaralhadas[perguntaAtualIndex];

    let opcoesHtml = "";

    dados.opcoes.forEach((opcao, idx) => {
        opcoesHtml += `
            <button onclick="verificarResposta(${idx})">
                ${opcao}
            </button>
        `;
    });

    container.innerHTML = `
        <div style="padding:20px;font-family:sans-serif;">
            <h3>${dados.pergunta}</h3>
            ${opcoesHtml}
            <div id="feedback-container"></div>
        </div>
    `;
}

// ----------------------
// Verificar resposta
// ----------------------
function verificarResposta(idx) {
    const dados = perguntasEmbaralhadas[perguntaAtualIndex];
    const feedback = document.getElementById("feedback-container");

    if (idx === dados.correta) {
        progresso.pontuacao += 10;
        progresso.respostasCorretas++;
        mostrarEmojiAnimado("⭐");

        feedback.innerHTML = "✔ Correto!";
    } else {
        progresso.respostasErradas++;
        vidas--;
        mostrarEmojiAnimado("💥");

        feedback.innerHTML = "❌ Errado";

        if (vidas <= 0) {
            gameOver();
            return;
        }
    }

    salvarProgresso();
    setTimeout(proximaPergunta, 800);
}

// ----------------------
// Próxima pergunta
// ----------------------
function proximaPergunta() {
    perguntaAtualIndex++;
    mostrarPergunta();
    iniciarTimer();
}

// ----------------------
// Game Over
// ----------------------
function gameOver() {
    const container = document.getElementById("app");
    clearInterval(timerInterval);

    container.innerHTML = `
        <div style="text-align:center;padding:30px;">
            <h1>💀 Game Over</h1>
            <button onclick="renderizarMenu()">Voltar</button>
        </div>
    `;
}

// ----------------------
// Finalizar fase
// ----------------------
function finalizarFase() {
    const container = document.getElementById("app");
    clearInterval(timerInterval);

    container.innerHTML = `
        <div style="text-align:center;padding:30px;">
            <h2>🎉 Fase concluída!</h2>
            <button onclick="renderizarMenu()">Menu</button>
        </div>
    `;
}

// ----------------------
// Emoji animado
// ----------------------
function mostrarEmojiAnimado(emoji) {
    const el = document.createElement("div");

    el.innerText = emoji;
    el.style.position = "fixed";
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.transform = "translate(-50%, -50%) scale(0)";
    el.style.fontSize = "100px";
    el.style.zIndex = "9999";
    el.style.transition = "all 0.4s ease";

    document.body.appendChild(el);

    setTimeout(() => {
        el.style.transform = "translate(-50%, -50%) scale(1.5)";
    }, 50);

    setTimeout(() => {
        el.style.opacity = "0";
    }, 900);

    setTimeout(() => {
        el.remove();
    }, 1200);
}

// ----------------------
// Iniciar automaticamente
// ----------------------
window.onload = iniciarJogo;
