
const productList = document.getElementById("product-list");
const categories = document.getElementById("categories");
const emptyMessage = document.getElementById("empty-message");
const currentYear = document.getElementById("current-year");

// Formatear precios en córdobas nicaragüenses
function formatPrice(price) {
    return new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
        maximumFractionDigits: 2
    }).format(price);
}

// Mostrar productos del catálogo
function renderProducts(category = "todos") {
    const filteredProducts = products.filter(product => {
        const matchesCategory =
            category === "todos" ||
            product.category.toLowerCase() === category.toLowerCase();

        return matchesCategory && product.available;
    });

    productList.innerHTML = "";
    emptyMessage.hidden = filteredProducts.length > 0;

    filteredProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        // Imagen del producto
        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.onerror = function () {
            console.error(
                `No se pudo cargar la imagen de ${product.name}: ${product.image}`
            );

            this.alt = `Imagen no disponible: ${product.name}`;
            this.classList.add("image-not-found");
        };

        // Información del producto
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

        info.append(categoryText, name, price);

        // Mostrar talla únicamente cuando exista
        if (product.size) {
            const size = document.createElement("p");
            size.className = "product-size";
            size.textContent = `Tallas: ${product.size}`;
            info.appendChild(size);
        }

        // Mostrar presentación si el producto la tiene
        if (product.unit) {
            const unit = document.createElement("p");
            unit.className = "product-unit";
            unit.textContent = `Presentación: ${product.unit}`;
            info.appendChild(unit);
        }

        // Botones de contacto
        const buttons = document.createElement("div");
        buttons.className = "product-buttons";

        // WhatsApp
        const whatsapp = document.createElement("a");
        whatsapp.className = "product-button whatsapp-button";
        whatsapp.textContent = "WhatsApp";

        const whatsappNumber = "505XXXXXXXX";
        const message =
            `Hola, estoy interesado/a en ${product.name} de NC Variedades. ¿Está disponible?`;

        whatsapp.href =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";

        // Instagram
        const instagram = document.createElement("a");
        instagram.className = "product-button instagram-button";
        instagram.textContent = "Instagram";

        const instagramUser = "MY_USER";
        instagram.href =
            `https://www.instagram.com/${instagramUser}/`;

        instagram.target = "_blank";
        instagram.rel = "noopener noreferrer";

        buttons.append(whatsapp, instagram);
        info.appendChild(buttons);

        // Agregar tarjeta al catálogo
        card.append(image, info);
        productList.appendChild(card);
    });
}

// Filtros de categorías
categories.addEventListener("click", function (event) {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    document.querySelectorAll(".category-button").forEach(item => {
        item.classList.remove("active");
    });

    button.classList.add("active");
    renderProducts(button.dataset.category);
});

// Actualizar año del pie de página
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Comprobar que los productos estén cargados
if (typeof products !== "undefined" && Array.isArray(products)) {
    renderProducts();
} else {
    console.error("No se encontró el inventario de products.js.");

    if (emptyMessage) {
        emptyMessage.hidden = false;
        emptyMessage.textContent =
            "No se pudieron cargar los productos. Recargá la página.";
    }
}
