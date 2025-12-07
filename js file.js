
class MenuItem {
    constructor(id, name, price, image,description) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.image = image;
      this.description=description;

    }
  }
  function addToCart(id, name, price, image, restaurantId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({id, name, price, image, quantity: 1, restaurantId: restaurantId});
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
  }
  

function goToCart() {
  window.location.href = "cart.html";
}

function createCard(item) {
  const card = document.createElement("div");
  card.classList.add("item-card");

  const description = item.Description ? `<p>${item.Description}</p>` : "";

  card.innerHTML = `
    <img src="${item.Image}">
    <h3>${item.Name}</h3>
    ${description}
    <div class="price">${item.Price} EGP</div>
<button class="add-btn" onclick="addToCart(${item.Id}, '${item.Name}', ${item.Price}, '${item.Image}', restaurantId)">Add to Cart</button>
  `;
  return card;
}


function goToMenu(page) {
  window.location.href = page;
}

function logout() {
  const confirmLogout = confirm("Are you sure you want to log out?");

  if (confirmLogout) {
      localStorage.removeItem("loggedIn");   
      localStorage.removeItem("userId");   
      window.location.href = "logIn.html"; 
  }
}

const loggedSection = document.querySelector(".logged-section");
const guestSection = document.querySelector(".guest-section");

if (loggedSection && guestSection) {
  if (localStorage.getItem("loggedIn")) {
    loggedSection.style.display = "block";
    guestSection.style.display = "none";
  } else {
    loggedSection.style.display = "none";
    guestSection.style.display = "block";
  }
}


function guestExplore() {
  alert("Please login first to explore restaurants!");
  window.location.href = "logIn.html"; 
}
