
const productList = document.getElementById("product-list");
const categories = document.getElementById("categories");
const emptyMessage = document.getElementById("empty-message");
const currentYear = document.getElementById("current-year");

function formatPrice(price) {
    return new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
        maximumFractionDigits: 2
    }).format(price);
}

function renderProducts(category = "todos") {
    const filteredProducts = products.filter(product => {
        const matchesCategory =
            category === "todos" || product.category === category;

        return matchesCategory && product.available;
    });

    productList.innerHTML = "";

    emptyMessage.hidden = filteredProducts.length > 0;

    filteredProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.onerror = function () {
            this.style.display = "none";
        };

        const info = document.createElement("div");
        info.className = "product-info";

        const categoryText = document.createElement("p");
        categoryText.className = "product-category";
        categoryText.textContent = product.category;

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const size = document.createElement("p");
        size.className = "product-size";
        size.textContent = `Tallas: ${product.size}`;

        // Botón para ir a la página de contacto
        const button = document.createElement("a");
        button.className = "product-button";
        button.textContent = "Contactar";
        button.href = "contacto.html";

        info.append(categoryText, name, price, size, button);
        card.append(image, info);
        productList.appendChild(card);
    });
}

categories.addEventListener("click", function (event) {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    document.querySelectorAll(".category-button").forEach(item => {
        item.classList.remove("active");
    });

    button.classList.add("active");

    renderProducts(button.dataset.category);
});

currentYear.textContent = new Date().getFullYear();

renderProducts();
