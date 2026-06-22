// ================================
// TIMER
// Jornada da Sabedoria v0.9.0
// ================================

let tempoRestante = 15;
let timerInterval = null;

// ----------------------
// Iniciar timer
// ----------------------
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
            pararTimer();
            tempoEsgotado();
        }

    }, 1000);
}

// ----------------------
// Parar timer
// ----------------------
function pararTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// ----------------------
// Tempo esgotado
// ----------------------
function tempoEsgotado() {

    mostrarEmojiAnimado("⏰");

    progresso.respostasErradas++;

    vidas--;

    salvarProgresso();

    if (vidas <= 0) {
        setTimeout(() => {
            gameOver();
        }, 1000);
        return;
    }

    setTimeout(() => {
        proximaPergunta();
    }, 1000);
}
