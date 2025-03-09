console.log("Script.js carregado!");

function addItem() {
    console.log("Função addItem chamada!");

    const name = document.getElementById("item-name").value;
    const sizes = document.getElementById("item-size").value.split(",");
    const colors = document.getElementById("item-color").value.split(",");
    const quantity = document.getElementById("item-quantity").value;
    const file = document.getElementById("item-image").files[0];

    if (name && sizes.length && colors.length && quantity && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");

        fetch("https://api.cloudinary.com/v1_1/dcwquhiev/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Imagem enviada para Cloudinary:", data.secure_url);
            alert("Item adicionado com sucesso!");
        })
        .catch(error => {
            console.error("Erro ao fazer upload para Cloudinary:", error);
        });
    } else {
        alert("Preencha todos os campos e selecione uma imagem");
    }
}
