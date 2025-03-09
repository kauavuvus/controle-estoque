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

// Inicializando o Firebase corretamente
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
            loadInventory();
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

function loadInventory() {
    db.ref("inventory").on("value", snapshot => {
        const inventoryTable = document.getElementById("inventory");
        inventoryTable.innerHTML = "";
        snapshot.forEach(item => {
            const data = item.val();
            const row = `<tr>
                <td>${data.name}</td>
                <td>${data.size}</td>
                <td>${data.color}</td>
                <td>${data.quantity}</td>
                <td><button onclick="removeItem('${item.key}')">Remover</button></td>
            </tr>`;
            inventoryTable.innerHTML += row;
        });
    });
}

function addItem() {
    const name = document.getElementById("item-name").value;
    const size = document.getElementById("item-size").value;
    const color = document.getElementById("item-color").value;
    const quantity = document.getElementById("item-quantity").value;

    if (name && size && color && quantity) {
        const newItem = db.ref("inventory").push();
        newItem.set({ name, size, color, quantity });
        document.getElementById("item-name").value = "";
        document.getElementById("item-size").value = "";
        document.getElementById("item-color").value = "";
        document.getElementById("item-quantity").value = "";
    } else {
        alert("Preencha todos os campos");
    }
}

function removeItem(key) {
    db.ref("inventory/" + key).remove();
}
