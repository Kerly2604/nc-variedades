

const productList = document.getElementById("product-list");
const categories = document.getElementById("categories");
const emptyMessage = document.getElementById("empty-message");
const currentYear = document.getElementById("current-year");

// ==========================================
// CONFIGURACIÓN DE CONTACTO
// ==========================================

// Número de Nicaragua: código de país 505 + número.
const WHATSAPP_NUMBER = "50583873429";

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
// LOGO SVG DE WHATSAPP
// Mismo símbolo que en contacto.html
// ==========================================

function createWhatsAppIcon() {
    const wrapper = document.createElement("span");
    wrapper.className = "social-icon";
    wrapper.setAttribute("aria-hidden", "true");

    wrapper.innerHTML = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            focusable="false"
        >
            <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L.08 24l6.3-1.65a11.9 11.9 0 0 0 5.7 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.42ZM12.08 21.8a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.83 9.83 0 0 1-1.51-5.26c0-5.47 4.45-9.92 9.92-9.92a9.86 9.86 0 0 1 7.02 2.91 9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.89-9.94 9.89Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/>
        </svg>
    `;

    return wrapper;
}

// ==========================================
// LOGO SVG DE INSTAGRAM
// Mismo símbolo que en contacto.html
// ==========================================

function createInstagramIcon() {
    const wrapper = document.createElement("span");
    wrapper.className = "social-icon";
    wrapper.setAttribute("aria-hidden", "true");

    wrapper.innerHTML = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            focusable="false"
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
            ></rect>
            <circle
                cx="12"
                cy="12"
                r="4"
            ></circle>
            <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
            ></circle>
        </svg>
    `;

    return wrapper;
}

// ==========================================
// BOTÓN DE WHATSAPP
// Abre el chat con mensaje del producto
// ==========================================

function createWhatsAppButton(product) {
    const whatsapp = document.createElement("a");

    whatsapp.className = "product-button whatsapp-button";

    const message =
        `Hola, estoy interesado/a en ${product.name} de NC Variedades. ¿Está disponible?`;

    whatsapp.href =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.setAttribute(
        "aria-label",
        `Consultar por WhatsApp sobre ${product.name || "este producto"}`
    );

    whatsapp.append(
        createWhatsAppIcon(),
        document.createTextNode(" WhatsApp")
    );

    return whatsapp;
}

// ==========================================
// BOTÓN DE INSTAGRAM
// ==========================================

function createInstagramButton() {
    const instagram = document.createElement("a");

    instagram.className = "product-button instagram-button";
    instagram.href = INSTAGRAM_URL;
    instagram.target = "_blank";
    instagram.rel = "noopener noreferrer";
    instagram.setAttribute(
        "aria-label",
        "Visitar Instagram de NC Variedades"
    );

    instagram.append(
        createInstagramIcon(),
        document.createTextNode(" Instagram")
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
