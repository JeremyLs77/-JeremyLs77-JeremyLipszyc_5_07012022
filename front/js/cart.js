// Initialisation du local storage
let productsInLocalStorage = JSON.parse(localStorage.getItem("storedCart"));

const foundItem = document.getElementById("cart__items");

// Affichage des produits
function displayCart() {
  if (productsInLocalStorage?.length >= 1) {
    for (let product of productsInLocalStorage) {
      //Insertion de l'élément "article"
      let productArticle = document.createElement("article");
      foundItem.appendChild(productArticle).classList.add("cart__item");
      productArticle.setAttribute("data-id", product._id);
      productArticle.setAttribute("data-color", product.colors);

      //Insertion de l'image
      let cartProductImg = document.createElement("div");
      productArticle.appendChild(cartProductImg).classList.add("cart__item__img");
      cartProductImg.appendChild(document.createElement("img"));
      cartProductImg.firstChild.src = product.imageUrl;
      cartProductImg.firstChild.alt = product.altTxt;

      //Insertion de l'élément "content"
      let cartItemContent = document.createElement("div");
      let cartItemContentDesc = document.createElement("div");
      productArticle.appendChild(cartItemContent).classList.add("cart__item__content");
      cartItemContent.appendChild(cartItemContentDesc).classList.add("cart__item__content__description");
      cartItemContentDesc.appendChild(document.createElement("h2")).innerText = product.name;
      cartItemContentDesc.appendChild(document.createElement("p")).innerText = product.colors;

      // Insertion de l'élément prix unitaire
      fetch("http://localhost:3000/api/products" + "/" + product._id)
        .then((response) => response.json())
        .then((data) => {
          cartItemContentDesc.appendChild(document.createElement("p")).innerText = data.price + " €";
        });

      //Insertion de l'élément quantité
      let cartItemContentSettings = document.createElement("div");
      let cartItemContentSettingsQty = document.createElement("div");
      let itemQuantity = document.createElement("input");
      cartItemContent.appendChild(cartItemContentSettings).classList.add("cart__item__content__settings");
      cartItemContentSettings.appendChild(cartItemContentSettingsQty).classList.add("cart__item__content__settings__quantity");
      cartItemContentSettingsQty.appendChild(document.createElement("p")).innerText = "Quantité : ";
      cartItemContentSettingsQty.appendChild(itemQuantity).classList.add("itemQuantity");
      itemQuantity.type = "number";
      itemQuantity.name = "itemQuantity";
      itemQuantity.min = "1";
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
    document.querySelector("#cart__items").innerHTML = `
  <div class="cart__empty">
  <p>Votre panier est vide. <br> Veuillez sélectionner des produits depuis la page d'accueil.</p>
  </div>`;
  }
}
displayCart();

function getTotal() {
  if (productsInLocalStorage?.length >= 1) {
    // Affichage des quantités et somme totale de la commande
    let articleQuantity = document.getElementsByClassName("itemQuantity");
    let articleLength = articleQuantity.length,
      totalQuantity = 0;

    for (let i = 0; i < articleLength; ++i) {
      totalQuantity += articleQuantity[i].valueAsNumber;
    }

    let productTotalQuantity = document.getElementById("totalQuantity");
    productTotalQuantity.innerHTML = totalQuantity;
    console.log(totalQuantity);

    const priceArray = [];
    let price = 0;

    let priceTotal = 0;

    // Récupération du prix
    for (let product of productsInLocalStorage) {
      fetch("http://localhost:3000/api/products" + "/" + product._id)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.price);

          let articlePrice = data.price;
          let uniqueQuantity = product.productQty;

          price = articlePrice * uniqueQuantity;
          priceTotal += price;
          console.log("totaux" + price + "//" + priceTotal);
          priceArray.push(price);

          const totalPrice = document.getElementById("totalPrice");
          totalPrice.innerHTML = priceTotal;
        });
    }
  }
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
  for (let g = 0; g < qtyChange.length; g++) {
    qtyChange[g].addEventListener("change", (event) => {
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
    });
  }
}
modifyQuantities();

//-------- PARTIE FORMULAIRE

form = () => {
  const order = document.getElementById("order");
  order.addEventListener("click", (event) => {
    event.preventDefault();
    if (productsInLocalStorage === null || productsInLocalStorage == 0) {
      alert("Veuillez ajouter un ou plusieurs produits au panier pour pouvoir valider une commande.");
    } else {
      // Récupération des données du formulaire
      const contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      };

      // Test du prénom et affichage du message approprié
      formFirstName = () => {
        const validFirstName = contact.firstName;
        if (/^[a-zA-Z--]{2,20}$/.test(validFirstName)) {
          return true;
        } else {
          let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
          firstNameErrorMsg.innerHTML = "Champ invalide. Veuillez entrer un format nom/prénom valide.";
        }
      };

      // Test du nom et affichage du message approprié
      formName = () => {
        const validName = contact.lastName;
        if (/^[a-zA-Z\s-]{2,20}$/.test(validName)) {
          return true;
        } else {
          let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
          lastNameErrorMsg.innerHTML = "Champ invalide. Veuillez entrer un format nom/prénom valide.";
        }
      };

      // Test de l'adresse et affichage du message approprié
      formAddress = () => {
        const validAddress = contact.address;
        if (/^[a-zA-Z0-9\s-]{2,50}$/.test(validAddress)) {
          return true;
        } else {
          let addressErrorMsg = document.getElementById("addressErrorMsg");
          addressErrorMsg.innerHTML = "Champ invalide. Veuillez entrer un format d'adresse valide";
        }
      };

      // Test de la ville et affichage du message approprié
      formCity = () => {
        const validAddress = contact.city;
        if (/^[a-zA-Z-\s-]{2,20}$/.test(validAddress)) {
          return true;
        } else {
          let cityErrorMsg = document.getElementById("cityErrorMsg");
          cityErrorMsg.innerHTML = "Champ invalide. Veuillez entrer un format ville valide.";
        }
      };

      // Test de l'adresse e-mail et affichage du message approprié
      formEmail = () => {
        const validEmail = contact.email;
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(validEmail)) {
          return true;
        } else {
          let emailErrorMsg = document.getElementById("emailErrorMsg");
          emailErrorMsg.innerHTML = "Champ invalide. Veuillez entrer un format e-mail valide.";
        }
      };

      // Validation des informations utilisateur
      formCheck = () => {
        if (formFirstName() && formName() && formAddress() && formCity() && formEmail()) {
          return true;
        } else {
          alert("Une erreur est survenue, merci de vérifier vos informations");
        }
      };

      formCheck();

      //-------------------------------------------------

      const products = [];
      for (product of productsInLocalStorage) {
        let productId = product._id;
        products.push(productId);
      }

      console.log(products);

      // Récupération des données du formulaire et des produits dans un objet
      const cartData = {
        contact,
        products,
      };

      // Envoi des données du formulaire et des produits vers le serveur
      const checkOut = {
        method: "POST",
        body: JSON.stringify(cartData),
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch("http://localhost:3000/api/products/order", checkOut)
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("orderId", data.orderId);

          //Redirection vers la page de confirmation
          if (formCheck()) {
            document.location.href = `confirmation.html?id=${data.orderId}`;
          }
        });
    }
  });
};

form();
