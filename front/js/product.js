const id = document.URL.split("=").pop();
const addToCartBtn = document.getElementById('addToCart');
let productName = document.getElementById('title');
let productDesc = document.getElementById('description');
let productPrice = document.getElementById('price');
let productColors = document.getElementById("colors");
let cartItem = {};
let cart = [];

getProduct();


//Recuperation des données de l'API 
function getProduct() {
    fetch("http://localhost:3000/api/products/" + id)
        .then(function (gotProduct) {
            return gotProduct.json();
        })
        .catch((err) => {
            console.log(err);
        })

        // Modification du DOM avec les données de l'API
        .then(function (pickedProduct) {

            // Insertion des éléments
            let productImg = document.createElement("img");

            let couchColors = pickedProduct.colors;

            document.querySelector(".item__img").appendChild(productImg).src = pickedProduct.imageUrl;
            productImg.id = "canapimg";
            productImg.alt = pickedProduct.altTxt;
            productName.innerText = pickedProduct.name;
            productPrice.innerText = pickedProduct.price;
            productDesc.innerText = pickedProduct.description;

            // Gestion des choix de couleurs
            for (let colors of couchColors) {
                console.table(colors);
                let productColors = document.createElement("option");
                document.querySelector("#colors").appendChild(productColors);
                productColors.value = colors;
                productColors.innerHTML = colors;
            }
        })
};

//Fonction "Ajout au panier"
addToCartBtn.addEventListener("click", function () {

    let productQty = document.getElementById('quantity').value;
    let pickedColor = productColors.value;

    //Condition pour vérifier les valeurs quantité/couleur
    if (productQty > 0 && pickedColor != null) {

        //Vérification si un panier existe deja, sinon création du panier et de l'objet contenu
        if (localStorage.getItem("storedCart") === null) {
            addItem();
            alert('Le produit a bien été ajouté au panier');
        } else {
            //Récupération du panier existant
            try {
                cart = JSON.parse(localStorage.getItem("storedCart"));
            } catch (error) {
                console.log(error)
            }

            //Gestion des doublons
            let currentArray = cart.findIndex(f => f._id === id && f.colors === pickedColor);
            if (currentArray >= 0) {
                cart[currentArray].productQty = parseInt(cart[currentArray].productQty) + parseInt(productQty);
                localStorage.setItem("storedCart", JSON.stringify(cart));
                alert('Le produit a bien été ajouté au panier');
            } else {
                //Ajoute le produit au panier, et affiche un message de confirmation dans le navigateur
                addItem();
                alert('Le produit a bien été ajouté au panier');
            }

        }
        
    }
});

//Création d'article dans le panier

function addItem() {
    let productQty = document.getElementById('quantity').value;
    let pickedColor = productColors.value;
    let productImg = document.getElementById('canapimg');

    cartItem = {
        _id: id,
        name: productName.innerHTML,
        colors: pickedColor,
        productQty: productQty,
        price: productPrice.innerHTML,
        imageUrl: productImg.src,
        description: productDesc.innerHTML,
        altTxt: productImg.alt,
    }
    // Ajout de l'objet dans l'array
    cart.push(cartItem);
    localStorage.setItem("storedCart", JSON.stringify(cart));
}