
const initialProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "electronics",
    price: 5000,
    originalPrice: 5500,
    currency: "BDT",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Premium wireless headphones with immersive sound.",
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    category: "electronics",
    price: 3500,
    originalPrice: 4000,
    currency: "BDT",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600",
    description: "Mechanical keyboard for productivity and gaming.",
  },
  {
    id: 3,
    name: "Gaming Mouse",
    category: "accessories",
    price: 2000,
    originalPrice: 2500,
    currency: "BDT",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
    description: "Ergonomic gaming mouse with precision tracking.",
  },
];

let products = JSON.parse(localStorage.getItem("shopora-products")) || initialProducts;
let cart = [];
let activeCategory = "all";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const testProduct = document.getElementById("testProduct");

const formatPrice = (price) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

function saveProducts() {
  localStorage.setItem("shopora-products", JSON.stringify(products));
}


function renderProducts() {
  const search = searchInput.value.toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filtered.length
    ? filtered.map((product) => `
      <article
        class="product-card"
        onclick="openProduct(${product.id})"
        style="cursor:pointer"
      >
        <div class="product-image">
          <span class="product-badge">SPECIAL OFFER</span>
          <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3>${product.name}</h3>
          <p class="product-description">${product.description}</p>

          <div class="product-prices">
            <span class="current-price">
              ${formatPrice(product.price)}
            </span>
            <span class="old-price">
              ${formatPrice(product.originalPrice)}
            </span>
          </div>

          <button
            class="add-cart"
            onclick="event.stopPropagation(); addToCart(${product.id})"
          >
            Add to Cart
          </button>
        </div>
      </article>
    `).join("")
    : "<p>No products found.</p>";

  renderTestSelector();
}

function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}


function renderTestSelector() {
  const selected = testProduct.value;

  testProduct.innerHTML = products.map((product) => `
    <option value="${product.id}">${product.name}</option>
  `).join("");

  if (products.some((p) => String(p.id) === selected)) {
    testProduct.value = selected;
  }
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  cart.push(product);
  document.getElementById("cartCount").textContent = cart.length;

  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");

  cartItems.innerHTML = cart.length
    ? cart.map((item) => `
      <div class="cart-item">
        <span>${item.name}</span>
        <strong>${formatPrice(item.price)}</strong>
      </div>
    `).join("")
    : "<p style='padding:25px 0;color:#71717a'>Your cart is empty.</p>";

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  document.getElementById("cartTotal").textContent = formatPrice(total);
}

document.getElementById("cartButton").addEventListener("click", () => {
  document.getElementById("cartOverlay").classList.add("open");
});

document.getElementById("closeCart").addEventListener("click", () => {
  document.getElementById("cartOverlay").classList.remove("open");
});

document.getElementById("cartOverlay").addEventListener("click", (e) => {
  if (e.target.id === "cartOverlay") {
    e.currentTarget.classList.remove("open");
  }
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    button.classList.add("active");

    activeCategory = button.dataset.category;
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

// Simulate a 20% price drop.
document.getElementById("dropPrice").addEventListener("click", () => {
  const id = Number(testProduct.value);
  const product = products.find((p) => p.id === id);

  if (!product) return;

  const previousPrice = product.price;
  product.price = Math.round(previousPrice * 0.8);

  saveProducts();
  renderProducts();

  alert(
    `${product.name}\nPrevious: ${formatPrice(previousPrice)}\nNew: ${formatPrice(product.price)}`
  );
});

// Reset all product prices.
document.getElementById("resetPrice").addEventListener("click", () => {
  products = JSON.parse(JSON.stringify(initialProducts));
  saveProducts();
  renderProducts();
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
