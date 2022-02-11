// Initialisation du local storage
let productsInLocalStorage = JSON.parse(localStorage.getItem("storedCart"));
const foundItem = document.getElementById("cart__items");

cart();

function cart() {
  displayCart();
  deleteCart();
}

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

  function getTotal() {
    // Total des quantités
    var articleQuantity = document.getElementsByClassName("itemQuantity");
    var articleLength = articleQuantity.length,
      totalQuantity = 0;
  
    for (var i = 0; i < articleLength; ++i) {
      totalQuantity += articleQuantity[i].valueAsNumber;
    }
  
    let productTotalQuantity = document.getElementById("totalQuantity");
    productTotalQuantity.innerHTML = totalQuantity;
    console.log(totalQuantity);
  }
  getTotal();
  

// Supression d'articles dans le panier
function deleteCart() {
  let delBtn = document.querySelectorAll('.deleteItem');
  delBtn.forEach(btn => btn.addEventListener('click', function (event) {
    let target = event.target;
    let targetId = (target.closest('.cart__item')).getAttribute('data-id');
    let targetColor = (target.closest('.cart__item')).getAttribute('data-color');
    let productInCart = productsInLocalStorage.findIndex(f => f._id === targetId && f.colors === targetColor);
    productsInLocalStorage.splice(productInCart, 1);

    // Remplacement du localstorage avec les nouvelles valeurs
    localStorage.setItem("storedCart", JSON.stringify(productsInLocalStorage));
    cart();

    // Alerte de la mise à jour du panier
    alert("Le ou les articles ont bien été supprimés.");
    
  }));

}


// Changement des quantités dans le panier
function modifyQtt() {
  let qtyChange = document.querySelectorAll(".itemQuantity");

  for (let k = 0; k < qtyChange.length; k++){
      qtyChange[k].addEventListener("change" , (event) => {
          event.preventDefault();

          //Selection de l'element à modifier en fonction de son id ET sa couleur
          let quantityModif = productsInLocalStorage[k].productQty;
          let qttModifValue = qtyChange[k].valueAsNumber;
          
          const resultFind = productsInLocalStorage.find((el) => el.qttModifValue !== quantityModif);

          resultFind.productQty = qttModifValue;
          productsInLocalStorage[k].productQty = resultFind.productQty;

          localStorage.setItem("storedCart", JSON.stringify(productsInLocalStorage));
      
          // Refresh rapide
          location.reload();

          // Alerte de la mise à jour du panier
          alert("Le ou les articles ont bien été modifiés.");
      })
  }
}
modifyQtt();

  /* Total des prix */
function totalPrice() {
  const articleQuantity = document.getElementById("totalQuantity");
  const cartTotalPrice = document.getElementById("totalPrice");
  let productTotalQuantity = 0;
  let totalPriceProduct = 0;
  for (storedCart of productsInLocalStorage) {
    productTotalQuantity = parseInt(productTotalQuantity) + parseInt(storedCart.quantity);
    totalPriceProduct = totalPriceProduct + storedCart.quantity * storedCart.price;
  }
  articleQuantity.innerText = productTotalQuantity;
  cartTotalPrice.innerText = totalPriceProduct;
}
totalPrice();



//-------- PARTIE FORMULAIRE


// Nom et Prénom
const form = document.getElementsByClassName("cart__order__form")[0];

form.firstName.addEventListener("change", function () {
  validName(this);
});
form.lastName.addEventListener("change", function () {
  validName(this);
});

const validName = function (inputName) {
  let nameRegExp = new RegExp("^[^- ][a-zA-Z '-àâäéèêëïîôöùûü]*[^- ]$", "g");
  let testName = nameRegExp.test(inputName.value);
  if (testName) {
    inputName.nextElementSibling.innerHTML = "Validé";
    inputName.nextElementSibling.style.color = "green";
    return true;
  } else {
    inputName.nextElementSibling.innerHTML = "Saisissez votre prénom ou votre nom";
    inputName.nextElementSibling.style.color = "red";
    return false;
  }
};

// Adresse
form.address.addEventListener("change", function () {
  validAddress(this);
});

const validAddress = function (inputAdress) {
  let addressRegExp = new RegExp("^[0-9]{1,4} [^- ][a-zA-Z '-àâäéèêëïîôöùûü]*[^- ]$", "g");
  let testAdress = addressRegExp.test(inputAdress.value);
  if (testAdress) {
    inputAdress.nextElementSibling.innerHTML = "Validé";
    inputAdress.nextElementSibling.style.color = "green";
    return true;
  } else {
    inputAdress.nextElementSibling.innerHTML = "Saisissez votre adresse";
    inputAdress.nextElementSibling.style.color = "red";
    return false;
  }
};

// Ville
form.city.addEventListener("change", function () {
  validCity(this);
});

const validCity = function (inputCity) {
  let cityRegExp = new RegExp("^[^- ][a-zA-Z '-àâäéèêëïîôöùûü]*[^- ]$", "g");
  let testCity = cityRegExp.test(inputCity.value);
  if (testCity) {
    inputCity.nextElementSibling.innerHTML = "Validé";
    inputCity.nextElementSibling.style.color = "green";
    return true;
  } else {
    inputCity.nextElementSibling.innerHTML = "Saisissez votre ville";
    inputCity.nextElementSibling.style.color = "red";
    return false;
  }
};

// Email
form.email.addEventListener("change", function () {
  validEmail(this);
});

const validEmail = function (inputEmail) {
  let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$","g");
  let testEmail = emailRegExp.test(inputEmail.value);
  if (testEmail) {
    inputEmail.nextElementSibling.innerHTML = "Validé";
    inputEmail.nextElementSibling.style.color = "green";
    return true;
  } else {
    inputEmail.nextElementSibling.innerHTML ="Saisissez votre adresse mail complète";
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

      //Envoi de l'utilisateur vers la page de confirmation
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

// Déclaration d'une variable contenant les infos de la commande
  let Order = {
    contact,
    products,
  };
  //localStorage.setItem("products", JSON.stringify(Order))
  sendOrderToServer(Order);
}