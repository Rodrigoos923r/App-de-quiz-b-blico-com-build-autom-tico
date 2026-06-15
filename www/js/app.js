window.onerror = function(m, u, l) { alert("Erro: " + m + "\nLinha: " + l); };
let progresso = JSON.parse(localStorage.getItem('jornada_progresso')) || {
    fasesDesbloqueadas: ['eden'],
    pontuacao: 0,
    respostasCorretas: 0,
    respostasErradas: 0,
    conquistas: []
};

const fases = {
    eden: { nome: "Jardim do Éden", perguntas: perguntasEden, proxima: 'diluvio' },
    diluvio: { nome: "O Dilúvio e Babel", perguntas: perguntasDiluvio, proxima: 'patriarcas' },
    patriarcas: { nome: "Os Patriarcas", perguntas: perguntasPatriarcas, proxima: 'exodo' },
    exodo: { nome: "O Êxodo", perguntas: perguntasExodo, proxima: null }
};

let faseAtual = 'eden';
let perguntaAtualIndex = 0;
let vidas = 3;
let perguntasEmbaralhadas = [];
let tempoRestante = 15; 
let timerInterval = null;

const playSom = (id) => {
    const som = document.getElementById(id);
    if (som) { som.currentTime = 0; som.play().catch(() => {}); }
};

function gerarCoracoes() {
    return "❤️".repeat(vidas) + "🤍".repeat(3 - vidas);
}

function salvarProgresso() {
    localStorage.setItem('jornada_progresso', JSON.stringify(progresso));
}

function iniciarJogo() {
    renderizarMenu();
}

function renderizarMenu() {
    clearInterval(timerInterval);
    const container = document.getElementById('app');
    
    let html = `
        <div class="menu-container fade-in">
            <h1>Jornada da Sabedoria</h1>
            <p class="subtitulo">Pontuação Total: <strong>${progresso.pontuacao}</strong></p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #E4EBF1;">
            <h3 style="margin-bottom: 15px;">Selecione uma Jornada:</h3>
            <div style="display: flex; flex-direction: column; gap: 5px; align-items: center;">
    `;

    Object.keys(fases).forEach(chave => {
        const desbloqueada = progresso.fasesDesbloqueadas.includes(chave);
        if (desbloqueada) {
            html += `<button onclick="carregarFase('${chave}')">${fases[chave].nome}</button>`;
        } else {
            html += `<button disabled class="btn-disabled">🔒 ${fases[chave].nome}</button>`;
        }
    });

    html += `
                <button onclick="abrirPerfil()" style="background:#007bff; margin-top:20px;">👤 Ver Perfil</button>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function carregarFase(chave) {
    faseAtual = chave;
    perguntaAtualIndex = 0;
    vidas = 3;
    perguntasEmbaralhadas = [...fases[chave].perguntas].sort(() => Math.random() - 0.5);
    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('app');
    if (perguntaAtualIndex >= perguntasEmbaralhadas.length) {
        finalizarFase();
        return;
    }

    const dados = perguntasEmbaralhadas[perguntaAtualIndex];
    let opcoesHtml = '';
    
    dados.opcoes.forEach((opcao, idx) => {
        opcoesHtml += `
            <button class="opcao" onclick="verificarResposta(${idx})">
                ${opcao}
            </button>
        `;
    });

    container.innerHTML = `
        <div class="card-pergunta fade-in">
            <div class="info">
                <button class="btn-voltar-topo" onclick="renderizarMenu()">⬅ Voltar</button>
                <span>${perguntaAtualIndex + 1}/${perguntasEmbaralhadas.length}</span>
            </div>
            
            <div style="font-size: 24px; text-align: center; margin-bottom: 10px;">
                ${gerarCoracoes()}
            </div>
            
            <div class="timer-container">
                <div class="timer-bar" id="timer-bar" style="width: 100%;"></div>
            </div>

            <h2 class="pergunta">${dados.pergunta}</h2>
            <div id="opcoes-container">${opcoesHtml}</div>
            <div id="feedback-container" style="margin-top: 15px;"></div>
        </div>
    `;
    
    iniciarTimer();
}

function verificarResposta(idxSelecionado) {
    clearInterval(timerInterval);
    
    const dados = perguntasEmbaralhadas[perguntaAtualIndex];
    const feedbackDiv = document.getElementById('feedback-container');
    const botoes = document.getElementById('opcoes-container').getElementsByTagName('button');

    for (let i = 0; i < botoes.length; i++) {
        botoes[i].disabled = true;
        botoes[i].classList.add('btn-disabled');
        if (i === dados.correta) {
            botoes[i].style.background = '#d4edda';
            botoes[i].style.borderColor = '#28A745';
            botoes[i].style.color = '#155724';
            botoes[i].style.opacity = '1';
        }
    }

    if (idxSelecionado === dados.correta) {
        playSom('som-acerto');
        progresso.pontuacao += 10;
        progresso.respostasCorretas += 1;
        mostrarEmojiAnimado("⭐");
        
        feedbackDiv.innerHTML = `
            <p style="color: #28a745; font-size: 18px; font-weight: bold; margin-bottom: 5px;">🌟 Muito bem!</p>
            <p style="font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-left: 4px solid #28a745; border-radius:4px;">${dados.explicacao}</p>
        `;
    } else {
        playSom('som-erro');
        botoes[idxSelecionado].style.background = '#f8d7da';
        botoes[idxSelecionado].style.borderColor = '#DC3545';
        botoes[idxSelecionado].style.color = '#721c24';
        botoes[idxSelecionado].style.opacity = '1';
        
        progresso.respostasErradas += 1;
        vidas--;
        mostrarEmojiAnimado("💥");
        
        if (vidas <= 0) {
            setTimeout(gameOver, 1000);
            return;
        }
        
        feedbackDiv.innerHTML = `
            <p style="color: #dc3545; font-weight: bold; margin-bottom: 5px;">❌ Resposta Errada</p>
            <p style="font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-left: 4px solid #dc3545; border-radius:4px;">${dados.explicacao}</p>
        `;
    }

    feedbackDiv.innerHTML += `
        <button onclick="proximaPergunta()" style="margin-top: 15px; background: #28a745;">
            Avançar ➡️
        </button>
    `;
    salvarProgresso();
}

function proximaPergunta() {
    perguntaAtualIndex++;
    mostrarPergunta();
}

function finalizarFase() {
    clearInterval(timerInterval);
    const container = document.getElementById('app');
    const proxima = fases[faseAtual].proxima;

    if (proxima && !progresso.fasesDesbloqueadas.includes(proxima)) {
        progresso.fasesDesbloqueadas.push(proxima);
    }
    salvarProgresso();

    container.innerHTML = `
        <div class="resultado fade-in" style="padding: 10px;">
            <h2>🎉 Parabéns!</h2>
            <p style="margin: 10px 0;">Você concluiu a jornada:<br><strong>${fases[faseAtual].nome}</strong></p>
            <p>Pontuação Atual: <strong>${progresso.pontuacao}</strong></p>
            <button onclick="renderizarMenu()">Voltar ao Menu</button>
        </div>
    `;
}

function gameOver() {
    clearInterval(timerInterval);
    const container = document.getElementById("app");
    container.innerHTML = `
        <div class="resultado fade-in" style="padding: 10px;">
            <h1>💀 Game Over</h1>
            <p style="margin: 10px 0;">Suas vidas acabaram na jornada do ${fases[faseAtual].nome}.</p>
            <button onclick="renderizarMenu()" style="background:#dc3545;">Voltar ao Menu</button>
        </div>
    `;
}

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
    el.style.pointerEvents = "none";
    document.body.appendChild(el);

    setTimeout(() => { el.style.transform = "translate(-50%, -50%) scale(1.5)"; }, 50);
    setTimeout(() => { el.style.transform = "translate(-50%, -50%) scale(0)"; el.style.opacity = "0"; }, 900);
    setTimeout(() => { el.remove(); }, 1200);
}

function tempoEsgotado() {
    clearInterval(timerInterval);
    mostrarEmojiAnimado("⏰");
    vidas--;

    if (vidas <= 0) {
        setTimeout(gameOver, 1000);
        return;
    }

    const feedbackDiv = document.getElementById('feedback-container');
    const botoes = document.getElementById('opcoes-container').getElementsByTagName('button');
    
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].disabled = true;
        botoes[i].classList.add('btn-disabled');
    }

    feedbackDiv.innerHTML = `
        <p style="color: #dc3545; font-weight: bold; margin-bottom: 5px;">⏰ Tempo Esgotado!</p>
        <button onclick="proximaPergunta()" style="margin-top: 15px; background: #007bff;">Avançar ➡️</button>
    `;
    salvarProgresso();
}

function iniciarTimer() {
    clearInterval(timerInterval);
    tempoRestante = 15;
    const barra = document.getElementById("timer-bar");

    timerInterval = setInterval(() => {
        tempoRestante--;
        if (barra) {
            barra.style.width = (tempoRestante / 15) * 100 + "%";
        }
        if (tempoRestante <= 0) {
            tempoEsgotado();
        }
    }, 1000);
}

function abrirPerfil() {
    clearInterval(timerInterval);
    const container = document.getElementById("app");

    container.innerHTML = `
        <div class="fade-in" style="padding: 10px;">
            <h1 style="text-align:center;">👤 PERFIL</h1>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #E4EBF1;">
            <div style="text-align:left; font-size:16px; line-height: 2.2; color: var(--primary);">
                🏆 <strong>Nível:</strong> 1<br>
                ⭐ <strong>XP:</strong> 0/100<br>
                ✅ <strong>Acertos:</strong> ${progresso.respostasCorretas}<br>
                ❌ <strong>Erros:</strong> ${progresso.respostasErradas}<br>
                🏅 <strong>Conquistas:</strong> ${progresso.conquistas.length}
            </div>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #E4EBF1;">
            <button onclick="renderizarMenu()">⬅ Voltar ao Menu</button>
        </div>
    `;
}

window.onload = iniciarJogo;
