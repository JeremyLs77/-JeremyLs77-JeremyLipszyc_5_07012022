// Initialisation du local storage
let productsInLocalStorage = JSON.parse(localStorage.getItem("storedCart"));

const foundItem = document.getElementById("cart__items");

// Affichage des produits
function displayCart() {

  if (productsInLocalStorage.length >= 1) {

    for (let product of productsInLocalStorage) {

      //Insertion de l'élément "article"
      let productArticle = document.createElement("article");
      foundItem.appendChild(productArticle).classList.add("cart__item");
      productArticle.setAttribute("data-id", product._id);
      productArticle.setAttribute("data-color", product.colors);

      //Insertion de l'image
      let cartProductImg = document.createElement("div");
      productArticle.appendChild(cartProductImg).classList.add("cart__item__img");
      cartProductImg.appendChild(document.createElement('img'));
      cartProductImg.firstChild.src = product.imageUrl;
      cartProductImg.firstChild.alt = product.altTxt;

      //Insertion de l'élément "content"
      let cartItemContent = document.createElement("div");
      let cartItemContentDesc = document.createElement("div");
      productArticle.appendChild(cartItemContent).classList.add("cart__item__content");
      cartItemContent.appendChild(cartItemContentDesc).classList.add("cart__item__content__description");
      cartItemContentDesc.appendChild(document.createElement('h2')).innerText = product.name;
      cartItemContentDesc.appendChild(document.createElement('p')).innerText = product.colors;
      cartItemContentDesc.appendChild(document.createElement('p')).innerText = product.price + " €";

      //Insertion de l'élément quantité
      let cartItemContentSettings = document.createElement("div");
      let cartItemContentSettingsQty = document.createElement("div");
      let itemQuantity = document.createElement("input");
      cartItemContent.appendChild(cartItemContentSettings).classList.add("cart__item__content__settings");
      cartItemContentSettings.appendChild(cartItemContentSettingsQty).classList.add("cart__item__content__settings__quantity");
      cartItemContentSettingsQty.appendChild(document.createElement('p')).innerText = 'Quantité : '
      cartItemContentSettingsQty.appendChild(itemQuantity).classList.add("itemQuantity");
      itemQuantity.type = "number";
      itemQuantity.name = "itemQuantity";
      itemQuantity.min = "1"
      itemQuantity.max = "100";
      itemQuantity.value = product.productQty;

      //Insertion de l'élément supprimer
      let cartItemContentSettingsDel = document.createElement("div");
      let cartItemContentSettingsDelP = document.createElement("p");
      cartItemContentSettings.appendChild(cartItemContentSettingsDel).classList.add("cart__item__content__settings__delete");
      cartItemContentSettingsDel.appendChild(cartItemContentSettingsDelP).classList.add("deleteItem");
      cartItemContentSettingsDelP.innerText = "Supprimer";
    
    }
    } else {
  document.querySelector("#cart__items").innerHTML =`
  <div class="cart__empty">
  <p>Votre panier est vide. <br> Veuillez sélectionner des produits depuis la page d'accueil.</p>
  </div>`;
}
  }
  displayCart();

  function getTotal() {
    // Affichage des quantités et somme totale de la commande
    var articleQuantity = document.getElementsByClassName("itemQuantity");
    var articleLength = articleQuantity.length,
      totalQuantity = 0;
  
    for (var i = 0; i < articleLength; ++i) {
      totalQuantity += articleQuantity[i].valueAsNumber;
    }
  
    let productTotalQuantity = document.getElementById("totalQuantity");
    productTotalQuantity.innerHTML = totalQuantity;

    const priceArray = [];
    let price = 0;

    for (let amount = 0; amount < articleQuantity.length; amount++) {
      let articlePrice = productsInLocalStorage[amount].price;
      let uniqueQuantity = productsInLocalStorage[amount].productQty;

      price = articlePrice * uniqueQuantity;
      priceArray.push(price);
    }

    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    let articlePrice = priceArray.reduce(reducer,0);

    const totalPrice = document.getElementById("totalPrice");
    totalPrice.innerHTML = articlePrice;
  }
  getTotal();
  

// Supression d'articles dans le panier
function deleteCart() {
  for (let i = 0; i < document.querySelectorAll(".deleteItem").length; i++) {
    document.querySelectorAll(".deleteItem")[i].addEventListener("click", (event) => {
        event.preventDefault();

        // Action qui supprime le produit
        productsInLocalStorage.splice(i, 1);
        window.localStorage.setItem("product", JSON.stringify(productsInLocalStorage));

        // Refresh rapide
        location.reload();

    // Remplacement du localstorage avec les nouvelles valeurs
    localStorage.setItem("storedCart", JSON.stringify(productsInLocalStorage));

    // Alerte de la mise à jour du panier
    alert("Le ou les articles ont bien été supprimés.");
    
  });
  }
}
deleteCart();


// Changement des quantités dans le panier
function modifyQuantities() {

  let qtyChange = document.getElementsByClassName("itemQuantity");

  // Boucle qui ajoute un eventListener sur les articles affichés dans le panier
  for (let g = 0; g < qtyChange.length; g++){
      qtyChange[g].addEventListener("change" , (event) => {
        event.preventDefault();
          
        // Séléction des quantités
          let prevQuantity = productsInLocalStorage[g].productQty;
          let newQuantity = qtyChange[g].valueAsNumber;
          
          // Vérification que les deux valeurs ne sont pas égales
          const resultFind = productsInLocalStorage.find((el) => el.newQuantity !== prevQuantity);

          // Remplace l'ancienne valeur quantité par la nouvelle
          resultFind.productQty = newQuantity;
          productsInLocalStorage[g].productQty = resultFind.productQty;

        // Remplacement du localstorage avec les nouvelles valeurs
      localStorage.setItem("storedCart", JSON.stringify(productsInLocalStorage));
      
      // Refresh rapide
      location.reload();

      // Alerte de la mise à jour du panier
      alert("Le ou les articles ont bien été modifiés.");

      }
    );}
  
}
modifyQuantities();

//-------- PARTIE FORMULAIRE


const form = document.getElementsByClassName("cart__order__form")[0];

// Champ nom et prénom

// Ecoute des modifications pour validation
form.firstName.addEventListener("change", function () {
  validName(this);
});
form.lastName.addEventListener("change", function () {
  validName(this);
});

// Déclaration de l'expression régulière Nom/Prénom
const validName = function (inputName) {
  let nameRegExp = new RegExp("^[A-Z][A-Za-zéç]+(\s[A-Z][A-Za-zéç]+)*$");

// Test du nom et affichage du message approprié
  let testName = nameRegExp.test(inputName.value);
  if (testName) {
    inputName.nextElementSibling.innerHTML = "Champ valide";
    inputName.nextElementSibling.style.color = "green";
    return true;
  } else {
    inputName.nextElementSibling.innerHTML = "Champ invalide. Veuillez entrer un format nom/prénom valide.";
    inputName.nextElementSibling.style.color = "red";
    return false;
  }
};

// Champ adresse

// Ecoute des modifications pour validation
form.address.addEventListener("change", function () {
  validAddress(this);
});

//Déclaration de l'expression régulière Adresse
const validAddress = function (inputAdress) {
  let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

// Test de l'adresse et affichage du message approprié  
  let testAdress = addressRegExp.test(inputAdress.value);
  if (testAdress) {
    inputAdress.nextElementSibling.innerHTML = "Champ valide";
    inputAdress.nextElementSibling.style.color = "green";
    return true;
  } else {
    inputAdress.nextElementSibling.innerHTML = "Champ invalide. Veuillez entrer un format d'adresse valide.";
    inputAdress.nextElementSibling.style.color = "red";
    return false;
  }
};

// Champ ville

//Ecoute des modifications pour validation
form.city.addEventListener("change", function () {
  validCity(this);
});

// Déclaration de l'expression régulière Ville
const validCity = function (inputCity) {
  let cityRegExp = new RegExp("^[a-zA-Z ,.'-]+$");

// Test de la ville et affichage du message approprié
  let testCity = cityRegExp.test(inputCity.value);
  if (testCity) {
    inputCity.nextElementSibling.innerHTML = "Champ valide";
    inputCity.nextElementSibling.style.color = "green";
    return true;
  } else {
    inputCity.nextElementSibling.innerHTML = "Champ invalide. Veuillez entrer un format ville valide.";
    inputCity.nextElementSibling.style.color = "red";
    return false;
  }
};

// Champ email

// Ecoute des modifications pour validation
form.email.addEventListener("change", function () {
  validEmail(this);
});

// Déclaration de l'expression régulière e-mail
const validEmail = function (inputEmail) {
  let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");

// Test de l'adresse e-mail et affichage du message approprié
  let testEmail = emailRegExp.test(inputEmail.value);
  if (testEmail) {
    inputEmail.nextElementSibling.innerHTML = "Champ valide";
    inputEmail.nextElementSibling.style.color = "green";
    return true;
  } else {
    inputEmail.nextElementSibling.innerHTML ="Champ invalide. Veuillez entrer un format e-mail valide.";
    inputEmail.nextElementSibling.style.color = "red";
    return false;
  }
};

// Envoi du formulaire 
let orderBtn = document.querySelector('#order');
orderBtn.addEventListener('click', (e) => {
  if (
    validName(form.firstName) &&
    validName(form.lastName) &&
    validAddress(form.address) &&
    validCity(form.city) &&
    validEmail(form.email)
  ) {
    pushOrder();
  } else {
    e.preventDefault();
    alert("Veuillez remplir le formulaire avec des informations valides.");
  }
});

const sendOrderToServer = (Order) => {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(Order),
    headers: { "Content-type": "application/JSON" },
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("orderId", data.orderId);

      //Redirection vers la page de confirmation
      window.location.href = "confirmation.html" + "?" + "name" + "=" + data.orderId;
    });
};

function pushOrder() {
  const products = [];
  for (product of productsInLocalStorage) {
    let productId = product._id;
    products.push(productId);
  }
  const contact = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    address: form.address.value,
    city: form.city.value,
    email: form.email.value,
  };

// Déclaration d'une variable contenant les informations de la commande
  let Order = {
    contact,
    products,
  };

  sendOrderToServer(Order);
}