
const productList = document.getElementById("product-list");
const categories = document.getElementById("categories");
const emptyMessage = document.getElementById("empty-message");
const currentYear = document.getElementById("current-year");

// Configuración de contacto
const WHATSAPP_NUMBER = "505XXXXXXXX";
const INSTAGRAM_USER = "MY_USER";

// Normalizar texto para comparar categorías
function normalizeText(text) {
    return String(text || "").trim().toLocaleLowerCase("es");
}

// Formatear precios en córdobas nicaragüenses
function formatPrice(price) {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
        return "Precio por consultar";
    }

    return new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
        maximumFractionDigits: 2
    }).format(amount);
}

// Obtener automáticamente las categorías del inventario
function getCategories() {
    const availableProducts = products.filter(
        product => product.available
    );

    const uniqueCategories = new Map();

    availableProducts.forEach(product => {
        const originalName = String(product.category || "").trim();

        if (!originalName) return;

        const key = normalizeText(originalName);

        if (!uniqueCategories.has(key)) {
            uniqueCategories.set(key, originalName);
        }
    });

    return [...uniqueCategories.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], "es"))
        .map(([key, name]) => ({ key, name }));
}

// Crear los botones automáticamente
function renderCategories() {
    categories.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = "category-button active";
    allButton.dataset.category = "todos";
    allButton.textContent = "Todo";
    allButton.setAttribute("aria-pressed", "true");

    categories.appendChild(allButton);

    getCategories().forEach(category => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "category-button";
        button.dataset.category = category.key;
        button.textContent = category.name;
        button.setAttribute("aria-pressed", "false");

        categories.appendChild(button);
    });
}

// Crear enlace de WhatsApp
function createWhatsAppButton(product) {
    const whatsapp = document.createElement("a");

    whatsapp.className = "product-button whatsapp-button";
    whatsapp.textContent = "WhatsApp";

    const message =
        `Hola, estoy interesado/a en ${product.name} de NC Variedades. ¿Está disponible?`;

    if (WHATSAPP_NUMBER !== "505XXXXXXXX") {
        whatsapp.href =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";
    } else {
        whatsapp.href = "#";
        whatsapp.title = "Configurá tu número de WhatsApp en app.js";

        whatsapp.addEventListener("click", event => {
            event.preventDefault();
            alert("Agregá tu número de WhatsApp en la configuración de app.js.");
        });
    }

    return whatsapp;
}

// Crear enlace de Instagram
function createInstagramButton() {
    const instagram = document.createElement("a");

    instagram.className = "product-button instagram-button";
    instagram.textContent = "Instagram";

    if (INSTAGRAM_USER !== "MY_USER") {
        instagram.href =
            `https://www.instagram.com/${INSTAGRAM_USER}/`;

        instagram.target = "_blank";
        instagram.rel = "noopener noreferrer";
    } else {
        instagram.href = "#";
        instagram.title = "Configurá tu usuario de Instagram en app.js";

        instagram.addEventListener("click", event => {
            event.preventDefault();
            alert("Agregá tu usuario de Instagram en la configuración de app.js.");
        });
    }

    return instagram;
}

// Crear una tarjeta de producto
function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    // Imagen
    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image || "";
    image.alt = product.name || "Producto de NC Variedades";
    image.loading = "lazy";

    image.onerror = function () {
        console.error(
            `No se pudo cargar la imagen de "${product.name}". Ruta: ${product.image}`
        );

        this.classList.add("image-not-found");
        this.alt = `Imagen no disponible: ${product.name}`;
    };

    // Información
    const info = document.createElement("div");
    info.className = "product-info";

    const categoryText = document.createElement("p");
    categoryText.className = "product-category";
    categoryText.textContent = product.category || "General";

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name || "Producto sin nombre";

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    info.append(categoryText, name, price);

    // Talla: solo si está definida
    if (product.size && String(product.size).trim()) {
        const size = document.createElement("p");
        size.className = "product-size";
        size.textContent = `Tallas: ${product.size}`;
        info.appendChild(size);
    }

    // Unidad o presentación: solo si está definida
    if (product.unit && String(product.unit).trim()) {
        const unit = document.createElement("p");
        unit.className = "product-unit";
        unit.textContent = `Presentación: ${product.unit}`;
        info.appendChild(unit);
    }

    // Contacto
    const buttons = document.createElement("div");
    buttons.className = "product-buttons";

    buttons.append(
        createWhatsAppButton(product),
        createInstagramButton()
    );

    info.appendChild(buttons);
    card.append(image, info);

    return card;
}

// Mostrar productos por categoría
function renderProducts(category = "todos") {
    const selectedCategory = normalizeText(category);

    const filteredProducts = products.filter(product => {
        const isAvailable = product.available === true;

        const matchesCategory =
            selectedCategory === "todos" ||
            normalizeText(product.category) === selectedCategory;

        return isAvailable && matchesCategory;
    });

    productList.innerHTML = "";

    if (emptyMessage) {
        emptyMessage.hidden = filteredProducts.length > 0;
    }

    filteredProducts.forEach(product => {
        productList.appendChild(createProductCard(product));
    });
}

// Manejar filtros y actualizar el botón activo
categories.addEventListener("click", function (event) {
    const button = event.target.closest("[data-category]");

    if (!button || !categories.contains(button)) return;

    categories.querySelectorAll(".category-button").forEach(item => {
        const isActive = item === button;

        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
    });

    renderProducts(button.dataset.category);
});

// Año automático
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Iniciar catálogo
if (
    productList &&
    categories &&
    emptyMessage &&
    typeof products !== "undefined" &&
    Array.isArray(products)
) {
    renderCategories();
    renderProducts();
} else {
    console.error(
        "No se pudo iniciar el catálogo. Revisá catalogo.html y products.js."
    );

    if (emptyMessage) {
        emptyMessage.hidden = false;
        emptyMessage.textContent =
            "No se pudieron cargar los productos. Intentá recargar la página.";
    }
}
