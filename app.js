
const productList = document.getElementById("product-list");
const categories = document.getElementById("categories");
const emptyMessage = document.getElementById("empty-message");
const currentYear = document.getElementById("current-year");

// ==========================================
// CONFIGURACIÓN DE CONTACTO
// ==========================================

// Escribí tu número con código de país, sin +, espacios ni guiones.
const WHATSAPP_NUMBER = "505XXXXXXXX";

// Instagram de NC VARIEDADES
const INSTAGRAM_USER = "n.c.variedades.store";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USER}/`;

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

// ==========================================
// VENTANA PARA AMPLIAR IMÁGENES
// ==========================================

const imageModal = document.createElement("div");
imageModal.className = "image-modal";
imageModal.setAttribute("role", "dialog");
imageModal.setAttribute("aria-modal", "true");
imageModal.setAttribute("aria-label", "Imagen ampliada del producto");
imageModal.setAttribute("aria-hidden", "true");

imageModal.innerHTML = `
    <button class="image-modal-close" type="button"
        aria-label="Cerrar imagen">&times;</button>
    <img class="image-modal-content" src="" alt="">
    <p class="image-modal-caption"></p>
`;

document.body.appendChild(imageModal);

const modalImage = imageModal.querySelector(".image-modal-content");
const modalCaption = imageModal.querySelector(".image-modal-caption");
const modalClose = imageModal.querySelector(".image-modal-close");

let previousFocusedElement = null;

function openImageModal(src, alt) {
    previousFocusedElement = document.activeElement;

    modalImage.src = src;
    modalImage.alt = alt;
    modalCaption.textContent = alt;

    imageModal.classList.add("is-open");
    imageModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("image-modal-open");

    modalClose.focus();
}

function closeImageModal() {
    if (!imageModal.classList.contains("is-open")) return;

    imageModal.classList.remove("is-open");
    imageModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("image-modal-open");

    modalImage.src = "";

    if (previousFocusedElement) {
        previousFocusedElement.focus();
    }
}

modalClose.addEventListener("click", closeImageModal);

imageModal.addEventListener("click", function (event) {
    if (event.target === imageModal) {
        closeImageModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (
        event.key === "Escape" &&
        imageModal.classList.contains("is-open")
    ) {
        closeImageModal();
    }
});

// ==========================================
// CATEGORÍAS AUTOMÁTICAS
// ==========================================

function getCategories() {
    const availableProducts = products.filter(
        product => product.available === true
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

// ==========================================
// BOTÓN DE WHATSAPP
// ==========================================

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

// ==========================================
// BOTÓN DE INSTAGRAM
// ==========================================

function createInstagramButton() {
    const instagram = document.createElement("a");

    instagram.className = "product-button instagram-button";
    instagram.textContent = "Instagram";
    instagram.href = INSTAGRAM_URL;
    instagram.target = "_blank";
    instagram.rel = "noopener noreferrer";
    instagram.setAttribute(
        "aria-label",
        "Visitar Instagram de NC Variedades"
    );

    return instagram;
}

// ==========================================
// TARJETA DE PRODUCTO
// ==========================================

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    // Imagen ampliable
    const image = document.createElement("img");

    image.className = "product-image product-image-zoom";
    image.src = product.image || "";
    image.alt = product.name || "Producto de NC Variedades";
    image.loading = "lazy";
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute(
        "aria-label",
        `Ampliar imagen de ${product.name || "producto"}`
    );

    function tryOpenImage() {
        if (
            image.src &&
            image.complete &&
            image.naturalWidth > 0 &&
            !image.classList.contains("image-not-found")
        ) {
            openImageModal(image.src, image.alt);
        }
    }

    image.addEventListener("click", tryOpenImage);

    image.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            tryOpenImage();
        }
    });

    image.onerror = function () {
        console.error(
            `No se pudo cargar la imagen de "${product.name}". Ruta: ${product.image}`
        );

        this.classList.add("image-not-found");
        this.alt = `Imagen no disponible: ${product.name}`;
        this.removeAttribute("role");
        this.removeAttribute("tabindex");
    };

    // Información del producto
    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name || "Producto sin nombre";

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    info.append(name, price);

    // Talla, si existe
    if (product.size && String(product.size).trim()) {
        const size = document.createElement("p");
        size.className = "product-size";
        size.textContent = `Tallas: ${product.size}`;
        info.appendChild(size);
    }

    // Unidad o presentación, si existe
    if (product.unit && String(product.unit).trim()) {
        const unit = document.createElement("p");
        unit.className = "product-unit";
        unit.textContent = `Presentación: ${product.unit}`;
        info.appendChild(unit);
    }

    // Botones de contacto
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

// ==========================================
// MOSTRAR PRODUCTOS POR CATEGORÍA
// ==========================================

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

// Manejar filtros y actualizar botón activo
if (categories) {
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
}

// ==========================================
// AÑO AUTOMÁTICO
// ==========================================

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// ==========================================
// INICIAR CATÁLOGO
// ==========================================

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
