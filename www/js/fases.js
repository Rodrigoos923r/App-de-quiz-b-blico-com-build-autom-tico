// ================================
// FASES DO JOGO
// Jornada da Sabedoria v0.9.0
// ================================

const fases = {
    eden: {
        nome: "Jardim do Éden",
        perguntas: perguntasEden,
        proxima: "diluvio"
    },

    diluvio: {
        nome: "O Dilúvio e Babel",
        perguntas: perguntasDiluvio,
        proxima: "patriarcas"
    },

    patriarcas: {
        nome: "Os Patriarcas",
        perguntas: perguntasPatriarcas,
        proxima: "exodo"
    },

    exodo: {
        nome: "O Êxodo",
        perguntas: perguntasExodo,
        proxima: null
    }
};
