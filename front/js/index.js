//Récupération des produits depuis l'API

getProducts();

function getProducts() {
  fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
      addProducts(data);
    })
    .catch((_error) => {
      alert("Une erreur est survenue");
    });
}

//Affichage des produits sur la page d'accueil

function addProducts(data) {
  for (product of data) {
    const itemCard = document.getElementById("items");
    itemCard.innerHTML += `
    <a href="./product.html?id=${product._id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
    </a>`;
  }
}
