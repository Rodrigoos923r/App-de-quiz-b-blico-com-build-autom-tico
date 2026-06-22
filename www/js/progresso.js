// ================================
// PROGRESSO DO JOGADOR
// Jornada da Sabedoria v0.9.0
// ================================

let progresso = JSON.parse(
    localStorage.getItem("jornada_progresso")
) || {
    fasesDesbloqueadas: ["eden"],
    pontuacao: 0,
    respostasCorretas: 0,
    respostasErradas: 0,
    conquistas: []
};

// ----------------------
// Salvar progresso
// ----------------------
function salvarProgresso() {
    localStorage.setItem(
        "jornada_progresso",
        JSON.stringify(progresso)
    );

    // Será usado quando Firebase estiver ativo
    if (typeof salvarNaNuvem === "function") {
        try {
            salvarNaNuvem();
        } catch (e) {
            console.log("Falha ao salvar na nuvem:", e);
        }
    }
}

// ----------------------
// Carregar progresso
// ----------------------
function carregarProgresso() {
    const salvo = localStorage.getItem("jornada_progresso");

    if (salvo) {
        progresso = JSON.parse(salvo);
    }

    return progresso;
}

// ----------------------
// XP
// ----------------------
function getXP() {
    return progresso.pontuacao;
}

// ----------------------
// Nível
// Cada 100 XP sobe 1 nível
// ----------------------
function getNivel() {
    return Math.floor(getXP() / 100) + 1;
}

// ----------------------
// XP dentro do nível
// ----------------------
function getXPAtualNivel() {
    return getXP() % 100;
}

// ----------------------
// XP necessário
// ----------------------
function getXPProximoNivel() {
    return 100;
}

// ----------------------
// Sincronização com o Firebase Firestore
// ----------------------
function salvarNaNuvem() {
    const usuario = firebase.auth().currentUser;
    
    if (!usuario) {
        console.log("Firebase: Nenhum usuário logado no momento. Mantendo apenas salvamento local.");
        return;
    }

    // Balão de teste para sabermos que a função foi ativada!
    alert("Tentando enviar pontos para a nuvem...");

    firebase.firestore().collection("usuarios").doc(usuario.uid).set({
        pontos: progresso.pontuacao,
        respostasCorretas: progresso.respostasCorretas,
        respostasErradas: progresso.respostasErradas
    }, { merge: true })
    .then(() => {
        alert("✅ Pontos sincronizados com a Nuvem!");
    })
    .catch((erro) => {
        alert("❌ Erro ao salvar na nuvem: " + erro.message);
    });
}
