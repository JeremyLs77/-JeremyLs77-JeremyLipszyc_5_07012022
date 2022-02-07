// Initialisation du local storage
let openedCart = JSON.parse(localStorage.getItem("storedCart"));
const foundItem = document.getElementById("cart__items");

cart();

function cart() {
  displayCart();
  deleteCart();
}

// Affichage des produits
function displayCart() {

  if (openedCart.length >= 1) {

    for (let product of openedCart) {

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

// Supression d'articles dans le panier
function deleteCart() {
  let delBtn = document.querySelectorAll('.deleteItem');
  delBtn.forEach(btn => btn.addEventListener('click', function (event) {
    let target = event.target;
    let targetId = (target.closest('.cart__item')).getAttribute('data-id');
    let targetColor = (target.closest('.cart__item')).getAttribute('data-color');
    let productInCart = openedCart.findIndex(f => f._id === targetId && f.colors === targetColor);
    openedCart.splice(productInCart, 1);

    // Remplacement du localstorage avec les nouvelles valeurs
    localStorage.setItem("storedCart", JSON.stringify(openedCart));
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
          let quantityModif = openedCart[k].productQty;
          let qttModifValue = qtyChange[k].valueAsNumber;
          
          const resultFind = openedCart.find((el) => el.qttModifValue !== quantityModif);

          resultFind.productQty = qttModifValue;
          openedCart[k].productQty = resultFind.productQty;

          localStorage.setItem("storedCart", JSON.stringify(openedCart));
      
          // refresh rapide
          location.reload();

          // Alerte de la mise à jour du panier
          alert("Le ou les articles ont bien été modifiés.");
      })
  }
}
modifyQtt();


