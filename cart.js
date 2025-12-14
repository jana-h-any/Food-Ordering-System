let cart = JSON.parse(localStorage.getItem("cart")) || [];
let addresses = [];
let selectedAddressId = null;

const tableBody = document.querySelector("#cartTable tbody");
const totalPriceEl = document.getElementById("totalPrice");
const addressesList = document.getElementById("addresses-list");
const addAddressBtn = document.getElementById("add-address-btn");
const newAddressForm = document.getElementById("new-address-form");
const saveAddressBtn = document.getElementById("save-address-btn");

function displayCart() {
    tableBody.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>${item.price} EGP</td>
            <td>
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    ${item.quantity}
                    <button onclick="increaseQuantity(${index})">+</button>
                </div>
            </td>
            <td><button class="remove-btn" onclick="removeItem(${index})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });

    totalPriceEl.textContent = "Total: " + total + " EGP";
    localStorage.setItem("cart", JSON.stringify(cart));
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    displayCart();
}

function decreaseQuantity(index) {
    if(cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeItem(index);
    }
    displayCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    displayCart();
}

async function loadAddresses() {
    const userId = localStorage.getItem("userId");
    if(!userId) return;

    try {
        const res = await fetch(`http://localhost:3000/address/user?userId=${userId}`);
        addresses = await res.json();
        renderAddresses();
    } catch(err) {
        console.error(err);
    }
}
function renderAddresses() {
    addressesList.innerHTML = "";
    addresses.forEach(addr => {
        const div = document.createElement("div");
        
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "address";
        radio.value = addr.Id;
        radio.id = "addr-" + addr.Id;
        if(selectedAddressId === addr.Id) radio.checked = true;

        const label = document.createElement("label");
        label.htmlFor = radio.id;
        label.textContent = `${addr.FullAddress}${addr.Notes ? ' ('+addr.Notes+')' : ''}`;

        radio.addEventListener("change", () => {
            selectedAddressId = addr.Id;
        });

        div.appendChild(radio);
        div.appendChild(label);
        addressesList.appendChild(div);
    });

    if(addresses.length > 0 && !selectedAddressId){
        selectedAddressId = addresses[0].Id;
        addressesList.querySelector("input").checked = true;
    }
}

function selectAddress(id) {
    selectedAddressId = id;
}

addAddressBtn.addEventListener("click", () => {
    newAddressForm.style.display = "block";
});

saveAddressBtn.addEventListener("click", async () => {
    const fullAddress = document.getElementById("fullAddress").value;
    const notes = document.getElementById("notes").value;
    const userId = localStorage.getItem("userId");

    if(!fullAddress){
        alert("Please enter full address!");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/address/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, fullAddress, notes })
        });
        const result = await res.json();
        if(result.success){
            addresses.push({ Id: result.addressId, FullAddress: fullAddress, Notes: notes });
            renderAddresses();
            newAddressForm.style.display = "none";
        }
    } catch(err) {
        console.error(err);
        alert("Failed to save address");
    }
});

async function checkout() {

    const userId = localStorage.getItem("userId");
    if(!userId){
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }   


    if(cart.length === 0){
        alert("Your cart is empty!");
        return;
    }


    if(!selectedAddressId){
        alert("Please select a delivery address!");
        return;
    }

  
    const ordersByRestaurant = cart.reduce((acc, item) => {
        if(!acc[item.restaurantId]) acc[item.restaurantId] = [];
        acc[item.restaurantId].push(item);
        return acc;
    }, {});

    try {
        for(const restaurantId in ordersByRestaurant){
            const items = ordersByRestaurant[restaurantId];
            const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

            const orderData = {
                userId: parseInt(userId),
                restaurantId: parseInt(restaurantId),
                addressId: parseInt(selectedAddressId),
                items: items.map(i => ({
                    menuItemId: i.id,
                    quantity: i.quantity,
                    price: i.price
                })),
                totalPrice
            };

            const response = await fetch("http://localhost:3000/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if(!result.success){
                alert("Error placing order for restaurant " + restaurantId);
            }
        }

     //  alert("Your order placed successfully!");
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();

        const video = document.createElement("video");
video.src = "assets/ss.mp4"; 
video.autoplay = true;
video.muted = true; 
video.style.position = "fixed";
video.style.top = "0";
video.style.left = "0";
video.style.width = "100%";
video.style.height = "100%";
video.style.objectFit = "cover";
video.style.zIndex = "9999";
video.style.opacity = "0";
video.style.transition = "opacity 0.5s";
document.body.appendChild(video);

setTimeout(() => {
    video.style.opacity = "1";
}, 50);

setTimeout(() => {
    video.style.opacity = "0";
    setTimeout(() => {
        video.remove();
        window.location.href = "history.html";
    }, 500);
}, 4000);

    } catch(err) {
        console.error(err);
        alert("Failed to connect to server");
    }
}

function addToCart(menuItem, restaurantId){
    const item = {
        id: menuItem.Id,
        name: menuItem.Name,
        price: menuItem.Price,
        image: menuItem.Image,
        quantity: 1,
        restaurantId: restaurantId
    };
    cart.push(item);
    displayCart();
}

displayCart();
loadAddresses();


