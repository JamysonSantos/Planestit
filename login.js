// Cole suas configurações do Firebase aqui
const firebaseConfig = {
  apiKey: "SEU_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);

// Para utilizar os recursos de autenticação e banco de dados
const auth = firebase.auth();

// Função para redirecionar usuários autenticados
function redirectToHomeIfAuthenticated() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      window.location.href = "home.html";
    }
  });
}

// Adiciona um listener quando o documento HTML estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  redirectToHomeIfAuthenticated();

  // Adiciona um listener para o evento de submit no formulário de login
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Verifica se o dispositivo está conectado à internet
    if (navigator.onLine) {
      // Chama o método `signInWithEmailPassword()`
      signInWithEmailPassword(email, password);
    } else {
      // Exiba uma mensagem de erro
      alert("O dispositivo não está conectado à internet.");
    }
  });

  // Atualização para mostrar a senha no campo de entrada
  // Adiciona um listener para o evento de click no checkbox
  const showPasswordCheckbox = document.getElementById("showPassword");
  showPasswordCheckbox.addEventListener("click", function() {
    if (showPasswordCheckbox.checked) {
      // Exibe a senha no campo de entrada
      document.getElementById("password").type = "text";
    } else {
      // Oculta a senha no campo de entrada
      document.getElementById("password").type = "password";
    }
  });
});

// Função de autenticação por email e senha
function signInWithEmailPassword(email, password) {
  // Chama o método `signInWithEmailAndPassword()` do Firebase
  auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Usuário autenticado com sucesso
    const user = userCredential.user;
    console.log(user);
    // Redirecionamento após o login bem-sucedido
    window.location.href = 'home.html';
  })
  .catch((error) => {
    // Tratamento de erro
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorMessage);

    // Verifica se o erro é de conexão com a internet
    if (errorCode === "auth/network-request-failed") {
      // Exibe uma mensagem de erro personalizada
      alert("O dispositivo não está conectado à internet.");
    } else {
      // Exibe a mensagem de erro padrão do Firebase
      alert(errorMessage);
    }
  });
}
