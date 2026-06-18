// Configuração do seu projeto extraída do Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBZPQu9a5rqGBLRLIyJsyh9SVrEqE3FCZc",
  authDomain: "quiz-biblico-8bcdb.firebaseapp.com",
  projectId: "quiz-biblico-8bcdb",
  storageBucket: "quiz-biblico-8bcdb.firebasestorage.app",
  messagingSenderId: "989946576987",
  appId: "1:989946576987:web:fdf5dd684cca1c3dc0bf7e",
  measurementId: "G-6HQVXJMB0G"
};

// Inicializa o Firebase com proteção contra duplicação
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// Controle de Modo (Login ou Cadastro)
let modoCadastro = false;

// Ajustado para bater exatamente com os IDs do seu novo login.html
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('senha'); // Corrigido de 'password' para 'senha'
const btnPrincipal = document.getElementById('btnEntrar'); // Corrigido para o botão principal
const btnAlternar = document.getElementById('btnAlternar'); // Corrigido para o botão secundário
const groupNome = document.getElementById('groupNome');
const tituloTela = document.getElementById('tituloTela');
const mensagemErro = document.getElementById('mensagemErro');

// Lógica inteligente para alternar as telas
btnAlternar.addEventListener('click', () => {
    modoCadastro = !modoCadastro;
    mensagemErro.innerText = "";
    
    if (modoCadastro) {
        tituloTela.innerText = "CREATE ACCOUNT";
        btnPrincipal.innerText = "CADASTRAR";
        btnAlternar.innerText = "Já tenho uma conta. Entrar";
        groupNome.style.display = "block";
    } else {
        tituloTela.innerText = "SIGN IN";
        btnPrincipal.innerText = "SIGN IN";
        btnAlternar.innerText = "Criar uma nova conta";
        groupNome.style.display = "none";
    }
});

// Executa a ação correta com base no modo atual
btnPrincipal.addEventListener('click', () => {
    mensagemErro.innerText = "";
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        mensagemErro.innerText = "Preencha o e-mail e a senha!";
        return;
    }

    if (modoCadastro) {
        // Fluxo de Cadastro
        const nome = nomeInput.value.trim();
        if (!nome) { 
            mensagemErro.innerText = "Digite seu nome para o ranking!"; 
            return; 
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                return firebase.firestore().collection("usuarios").doc(userCredential.user.uid).set({
                    nome: nome,
                    email: email,
                    pontos: 0
                }, { merge: true });
            })
            .then(() => {
                alert("Conta criada com sucesso! Entrando...");
                window.location.href = "index.html";
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    mensagemErro.innerText = "Este e-mail já está em uso por outro usuário.";
                } else {
                    mensagemErro.innerText = "Erro ao cadastrar: " + error.message;
                }
            });
    } else {
        // Fluxo de Login
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                window.location.href = "index.html";
            })
            .catch((error) => {
                mensagemErro.innerText = "Erro ao entrar: " + error.message;
            });
    }
});
