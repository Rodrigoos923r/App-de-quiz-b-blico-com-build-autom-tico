// Janela de alerta global para capturar erros logo na inicialização do app
window.onerror = function(message, source, lineno, colno, error) {
    alert("Erro crítico no JS:\n" + message + "\nLinha: " + lineno);
    return false;
};

const firebaseConfig = {
  apiKey: "AIzaSyBZPQu9a5rqGBLRLIyJsyh9SVrEqE3FCZc",
  authDomain: "quiz-biblico-8bcdb.firebaseapp.com",
  projectId: "quiz-biblico-8bcdb",
  storageBucket: "quiz-biblico-8bcdb.firebasestorage.app",
  messagingSenderId: "989946576987",
  appId: "1:989946576987:web:fdf5dd684cca1c3dc0bf7e",
  measurementId: "G-6HQVXJMB0G"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

let modoCadastro = false;

// Seletores protegidos (Definidos exatamente como estão no último login.html)
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('senha'); 
const btnPrincipal = document.getElementById('btnEntrar'); 
const btnAlternar = document.getElementById('btnAlternar'); 
const groupNome = document.getElementById('groupNome');
const tituloTela = document.getElementById('tituloTela');
const mensagemErro = document.getElementById('mensagemErro');

// Só adiciona os eventos se os botões realmente existirem na tela atual
if (btnAlternar && btnPrincipal) {
    btnAlternar.addEventListener('click', () => {
        modoCadastro = !modoCadastro;
        if(mensagemErro) mensagemErro.innerText = "";
        
        if (modoCadastro) {
            if(tituloTela) tituloTela.innerText = "CREATE ACCOUNT";
            btnPrincipal.innerText = "CADASTRAR";
            btnAlternar.innerText = "Já tenho uma conta. Entrar";
            if(groupNome) groupNome.style.display = "block";
        } else {
            if(tituloTela) tituloTela.innerText = "SIGN IN";
            btnPrincipal.innerText = "SIGN IN";
            btnAlternar.innerText = "Criar uma nova conta";
            if(groupNome) groupNome.style.display = "none";
        }
    });

    btnPrincipal.addEventListener('click', () => {
        if(mensagemErro) mensagemErro.innerText = "";
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value.trim() : "";

        if (!email || !password) {
            if(mensagemErro) mensagemErro.innerText = "Preencha o e-mail e a senha!";
            return;
        }

        if (modoCadastro) {
            const nome = nomeInput ? nomeInput.value.trim() : "";
            if (!nome) { 
                if(mensagemErro) mensagemErro.innerText = "Digite seu nome para o ranking!"; 
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
                    if(mensagemErro) {
                        if (error.code === "auth/email-already-in-use") {
                            mensagemErro.innerText = "Este e-mail já está em uso por outro usuário.";
                        } else {
                            mensagemErro.innerText = "Erro ao cadastrar: " + error.message;
                        }
                    }
                });
        } else {
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    if(mensagemErro) mensagemErro.innerText = "Erro ao entrar: " + error.message;
                });
        }
    });
}
