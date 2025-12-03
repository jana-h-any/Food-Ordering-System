
class MenuItem {
    constructor(id, name, price, image,description) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.image = image;
      this.description=description;

    }
  }
const burger1 = new MenuItem(1, "Classic Burger", 150, "assets/menuItems/B1.jpg.", "Delicious beef burger");
const burger2 = new MenuItem(2, "Cheese Burger", 155, "assets/menuItems/B2.jpg", "Beef burger with cheese");
const burger3 = new MenuItem(3, "Chicken Zinger Burger", 160, "assets/menuItems/B3.jpg", "Hot and crispy chicken fillet packed with bold zinger flavor and special sauce.");
const burger4 = new MenuItem(4, "Bacon Burger", 152, "assets/menuItems/B4.jpg", "Burger with crispy bacon");
const burger5 = new MenuItem(5, "Spicy Chicken Burger", 148, "assets/menuItems/B5.jpg", "Healthy veggie patty");
const burger6 = new MenuItem(6, "Double Burger", 170, "assets/menuItems/B6.jpg", "Double beef patty burger");
const burger7 = new MenuItem(7, "Crispy Chicken Burger", 158, "assets/menuItems/B7.jpg", "Crunchy golden-fried chicken fillet with fresh lettuce and creamy mayo");
const burger8 = new MenuItem(8, "Mushroom Burger", 160, "assets/menuItems/B8.jpg", "Burger with sautéed mushrooms");
const burger9 = new MenuItem(9, "BBQ Burger", 162, "assets/menuItems/B9.jpg", "Burger with BBQ sauce");
const burger10 = new MenuItem(10, " Grilled Chicken Burger", 175, "assets/menuItems/B10.jpg", "Juicy grilled chicken breast served with fresh veggies and a light garlic sauce.");
const pizza1 = new MenuItem(11, "Margherita Pizza", 90, "assets/menuItems/P2.jpg", "Classic Italian pizza with fresh mozzarella, basil, and rich tomato sauce.");

const pizza2 = new MenuItem(12, "Pepperoni Pizza", 110, "assets/menuItems/P1.jpg", "Crispy pepperoni slices on a cheesy, flavorful tomato base.");

const pizza3 = new MenuItem(13, "BBQ Chicken Pizza", 120, "assets/menuItems/P3.jpg", "Tender chicken chunks with smoky BBQ sauce, onions, and melted cheese.");

const pizza4 = new MenuItem(14, "Veggie Supreme Pizza", 195, "assets/menuItems/P4.jpg", "A colorful mix of fresh vegetables on a perfectly baked cheesy crust.");
const pasta1 = new MenuItem(15, "Alfredo Pasta", 85, "assets/menuItems/Pa1.jpg", "Creamy Alfredo sauce with parmesan and tender fettuccine noodles.");

const pasta2 = new MenuItem(16, "Chicken Pasta", 95, "assets/menuItems/Pa2.jpg", "Grilled chicken tossed with pasta in a rich, savory cream sauce.");
const pasta3 = new MenuItem(17, "Spaghetti Bolognese", 100, "assets/menuItems/Pa3.jpg", "Traditional Italian spaghetti served with slow-cooked beef bolognese.");
const pasta4 = new MenuItem(18, "Pesto Pasta", 90, "assets/menuItems/Pa4.jpg", "Fresh basil pesto mixed with pasta and topped with parmesan cheese.");
const pasta5 = new MenuItem(19, "Shrimp Creamy Pasta", 120, "assets/menuItems/Pa5.jpg", "Juicy shrimp cooked in creamy garlic sauce with perfectly cooked pasta.");
 

function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({id, name, price, image, quantity:1});
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

  card.innerHTML = `
    <img src="${item.image}">
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <div class="price">${item.price} EGP</div>
    <button class="add-btn" onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.image}')">Add to Cart</button>
  `;
  return card;
}

function goToMenu(page) {
  window.location.href = page;
}