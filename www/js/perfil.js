// ================================
// PERFIL DO JOGADOR
// Jornada da Sabedoria v0.9.0
// ================================

function abrirPerfil() {

    pararTimer();

    const container = document.getElementById("app");

    const xp = getXP();
    const nivel = getNivel();
    const xpAtual = getXPAtualNivel();
    const xpProximo = getXPProximoNivel();

    container.innerHTML = `
        <div style="padding:20px;max-width:450px;margin:auto;font-family:sans-serif;">

            <h1 style="text-align:center;">
                👤 PERFIL DO JOGADOR
            </h1>

            <hr>

            <div style="line-height:2;font-size:18px;">

                🏆 <strong>Nível:</strong> ${nivel}<br>

                ⭐ <strong>XP:</strong>
                ${xpAtual}/${xpProximo}
                <br><br>

                🏅 <strong>Pontuação:</strong>
                ${progresso.pontuacao}
                <br>

                ✅ <strong>Acertos:</strong>
                ${progresso.respostasCorretas}
                <br>

                ❌ <strong>Erros:</strong>
                ${progresso.respostasErradas}
                <br>

                🎖️ <strong>Conquistas:</strong>
                ${progresso.conquistas.length}

            </div>

            <hr>

            <button
                onclick="renderizarMenu()"
                style="
                    width:100%;
                    padding:12px;
                    background:#4CAF50;
                    color:white;
                    border:none;
                    border-radius:8px;
                    cursor:pointer;
                "
            >
                ⬅ Voltar ao Menu
            </button>

        </div>
    `;
}
