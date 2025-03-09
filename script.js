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
                <div class="color-options">
                    ${data.colors.map(color => `<div class="color-circle" style="background:${color}"></div>`).join("")}
                </div>
                <div class="size-options">
                    ${data.sizes.map(size => `<button class="size-button">${size}</button>`).join("")}
                </div>
                <div class="quantity-control">
                    <button onclick="updateQuantity('${item.key}', -1)">-</button>
                    <span>${data.quantity}</span>
                    <button onclick="updateQuantity('${item.key}', 1)">+</button>
                </div>
            </div>`;
            container.innerHTML += productCard;
        });
    });
}

function updateQuantity(key, change) {
    db.ref(`inventory/${key}`).get().then(snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const newQuantity = Math.max(0, data.quantity + change);
            db.ref(`inventory/${key}`).update({ quantity: newQuantity });
        }
    });
}
