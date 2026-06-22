function salvarNaNuvem() {
    const usuario = firebase.auth().currentUser;
    if (usuario) {
        alert("Tentando enviar pontos para a nuvem: " + progresso.pontuacao);
        firebase.firestore().collection("usuarios").doc(usuario.uid).set({
            email: usuario.email,
            pontos: progresso.pontuacao,
            respostasCorretas: progresso.respostasCorretas,
            respostasErradas: progresso.respostasErradas
        }, { merge: true })
        .then(() => {
            alert("🎉 Sucesso! Dados gravados no Firebase!");
        })
        .catch(err => {
            alert("❌ Erro do Firestore: " + err.message);
            console.log("Erro Firestore:", err);
        });
    } else {
        alert("⚠️ Atenção: Nenhum usuário detectado pelo Firebase Auth!");
    }
}

