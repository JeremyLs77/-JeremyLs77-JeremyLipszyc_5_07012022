// Récupération de l'order id
const orderId = document.getElementById("orderId");

confirmedOrder = () => {
  // Affichage du numéro de commande et suppression du local storage
  orderId.innerHTML = localStorage.getItem("orderId");
  localStorage.clear();
};

confirmedOrder();
