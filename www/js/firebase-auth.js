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

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Selecionando os campos da tela
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnCadastrar = document.getElementById('btnCadastrar');
const mensagemErro = document.getElementById('mensagemErro');

// Ação para o botão de LOGIN
btnLogin.addEventListener('click', () => {
    mensagemErro.innerText = "";
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login feito com sucesso! Redireciona para o jogo principal
            window.location.href = "index.html";
        })
        .catch((error) => {
            mensagemErro.innerText = "Erro ao entrar: " + error.message;
        });
});

// Ação para o botão de CADASTRO
btnCadastrar.addEventListener('click', () => {
    mensagemErro.innerText = "";
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Conta criada com sucesso! Entrando...");
            window.location.href = "index.html";
        })
        .catch((error) => {
            mensagemErro.innerText = "Erro ao cadastrar: " + error.message;
        });
});

