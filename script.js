const firebaseConfig = {
    apiKey: "AIzaSyBzATYoPbh2ZDajIJEi7qupUHZVREsp-Aw",
    authDomain: "estoque-507ac.firebaseapp.com",
    databaseURL: "https://estoque-507ac-default-rtdb.firebaseio.com",
    projectId: "estoque-507ac",
    storageBucket: "estoque-507ac.firebasestorage.app",
    messagingSenderId: "1022296018574",
    appId: "1:1022296018574:web:90c5350eeb5a72a45f43df",
    measurementId: "G-JTGYQ498FD"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("login").style.display = "none";
            document.getElementById("app").style.display = "block";
            loadProducts();
        })
        .catch(error => {
            alert("Erro ao entrar: " + error.message);
        });
}

function logout() {
    auth.signOut().then(() => {
        document.getElementById("login").style.display = "block";
        document.getElementById("app").style.display = "none";
    });
}

function loadProducts() {
    db.ref("inventory").on("value", snapshot => {
        const container = document.getElementById("products-container");
        container.innerHTML = "";
        snapshot.forEach(item => {
            const data = item.val();
            const productCard = `<div class="product-card">
                <img src="${data.image}" alt="Imagem">
                <h3>${data.name}</h3>
                <div class="product-options">
                    <label>Cor:</label>
                    <select>${data.colors.map(color => `<option>${color}</option>`).join("")}</select>
                    <label>Tamanho:</label>
                    <select>${data.sizes.map(size => `<option>${size}</option>`).join("")}</select>
                </div>
                <p>Quantidade disponível: ${data.quantity}</p>
            </div>`;
            container.innerHTML += productCard;
        });
    });
}

function addItem() {
    const name = document.getElementById("item-name").value;
    const sizes = document.getElementById("item-size").value.split(",");
    const colors = document.getElementById("item-color").value.split(",");
    const quantity = document.getElementById("item-quantity").value;
    const file = document.getElementById("item-image").files[0];

    if (name && sizes.length && colors.length && quantity && file) {
        const storageRef = storage.ref("images/" + file.name);
        storageRef.put(file).then(snapshot => {
            snapshot.ref.getDownloadURL().then(url => {
                const newItem = db.ref("inventory").push();
                newItem.set({ name, sizes, colors, quantity, image: url });
                document.getElementById("item-name").value = "";
                document.getElementById("item-size").value = "";
                document.getElementById("item-color").value = "";
                document.getElementById("item-quantity").value = "";
                document.getElementById("item-image").value = "";
            });
        });
    } else {
        alert("Preencha todos os campos e selecione uma imagem");
    }
}
