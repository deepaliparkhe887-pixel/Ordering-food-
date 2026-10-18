// Online Food Ordering System

const foods = [
  {
    id: 1,
    name: "Pizza",
    price: 200,
    description: "Delicious cheese pizza with fresh toppings.",
    emoji: "🍕"
  },
  {
    id: 2,
    name: "Burger",
    price: 100,
    description: "Juicy burger with fresh vegetables.",
    emoji: "🍔"
  },
  {
    id: 3,
    name: "Sandwich",
    price: 80,
    description: "Fresh sandwich with tasty fillings.",
    emoji: "🥪"
  },
  {
    id: 4,
    name: "Biryani",
    price: 180,
    description: "Aromatic biryani with delicious spices.",
    emoji: "🍛"
  },
  {
    id: 5,
    name: "French Fries",
    price: 90,
    description: "Crispy golden french fries.",
    emoji: "🍟"
  },
  {
    id: 6,
    name: "Cold Drink",
    price: 40,
    description: "A chilled and refreshing drink.",
    emoji: "🥤"
  }
];

let cart = [];

const foodContainer = document.getElementById("foodContainer");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const placeOrderBtn = document.getElementById("placeOrderBtn");

function displayFoods(foodList = foods) {
  foodContainer.replaceChildren();

  if (foodList.length === 0) {
    const message = document.createElement("p");
    message.className = "no-results";
    message.textContent = "No food items found. Try another search.";
    foodContainer.appendChild(message);
    return;
  }

  foodList.forEach((food) => {
    const card = document.createElement("article");
    card.className = "food-card";

    const visual = document.createElement("div");
    visual.className = "food-visual";
    visual.setAttribute("role", "img");
    visual.setAttribute("aria-label", food.name);
    visual.textContent = food.emoji;

    const info = document.createElement("div");
    info.className = "food-info";

    const name = document.createElement("h3");
    name.textContent = food.name;

    const description = document.createElement("p");
    description.textContent = food.description;

    const bottom = document.createElement("div");
    bottom.className = "food-bottom";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = `₹${food.price}`;

    const button = document.createElement("button");
    button.className = "add-btn";
    button.type = "button";
    button.textContent = "Add to Cart";
    button.addEventListener("click", () => addToCart(food.id));

    bottom.append(price, button);
    info.append(name, description, bottom);
    card.append(visual, info);
    foodContainer.appendChild(card);
  });
}

function addToCart(foodId) {
  const food = foods.find((item) => item.id === foodId);
  if (!food) return;

  const existingItem = cart.find((item) => item.id === foodId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...food, quantity: 1 });
  }

  displayCart();
}

function displayCart() {
  cartItems.replaceChildren();

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent = "Your cart is empty!";
    cartItems.appendChild(empty);
  }

  let total = 0;
  let itemCount = 0;

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    itemCount += item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    const name = document.createElement("h4");
    name.textContent = `${item.emoji} ${item.name}`;

    const amount = document.createElement("p");
    amount.textContent = `₹${item.price} × ${item.quantity} = ₹${subtotal}`;
    details.append(name, amount);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Decrease ${item.name} quantity`);
    minus.addEventListener("click", () => changeQuantity(item.id, -1));

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Increase ${item.name} quantity`);
    plus.addEventListener("click", () => changeQuantity(item.id, 1));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-btn";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeItem(item.id));

    controls.append(minus, quantity, plus, remove);
    row.append(details, controls);
    cartItems.appendChild(row);
  });

  totalPrice.textContent = total;
  cartCount.textContent = itemCount;
}

function changeQuantity(foodId, change) {
  const item = cart.find((entry) => entry.id === foodId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeItem(foodId);
  } else {
    displayCart();
  }
}

function removeItem(foodId) {
  cart = cart.filter((item) => item.id !== foodId);
  displayCart();
}

searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.toLowerCase().trim();

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchText) ||
    food.description.toLowerCase().includes(searchText)
  );

  displayFoods(filteredFoods);
});

function placeOrder() {
  if (cart.length === 0) {
    alert("Please add food items to your cart first.");
    return;
  }

  const customerName = prompt("Enter your name:");
  if (customerName === null) return;

  if (!customerName.trim()) {
    alert("Please enter a valid name.");
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderDetails = cart
    .map((item) => `${item.name} × ${item.quantity}`)
    .join("\n");

  alert(
    "ORDER CONFIRMED!\n\n" +
    `Customer: ${customerName.trim()}\n\n` +
    `Items:\n${orderDetails}\n\n` +
    `Total Bill: ₹${total}\n\n` +
    "Thank you for ordering!"
  );

  cart = [];
  displayCart();
}

placeOrderBtn.addEventListener("click", placeOrder);
document.getElementById("year").textContent = new Date().getFullYear();

displayFoods();
displayCart();
