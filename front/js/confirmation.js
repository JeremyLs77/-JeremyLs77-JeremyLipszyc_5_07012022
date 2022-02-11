// Récuperation du numéro de commande via l'url
const urlConfirmation = new URL(window.location.href);

const getOrderId = () => {
  const getConfirmedOrderId = urlConfirmation.searchParams.get("name");
  document.getElementById("orderId").innerHTML = getConfirmedOrderId;
};
getOrderId();

// Suppression du local storage par mesure de sécurité
localStorage.clear();