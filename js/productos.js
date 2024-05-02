document.addEventListener("DOMContentLoaded", () => {
    const contenedorProducto = document.querySelector("#producto-detalle");

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Obtener el ID desde la URL

    // Función para mostrar mensajes emergentes (toasts)
const mostrarToast = (mensaje) => {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: 'right',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
};

    fetch("/Portafolio-Rodriguez/data/productos.json")
        .then((res) => res.json())
        .then((productos) => {
            const producto = productos.find((p) => p.id == productId); // Encuentra el producto por ID
            
            if (producto) {
                contenedorProducto.innerHTML = `
                    <h2>${producto.titulo}</h2>
                    <img src="${producto.img}" alt="${producto.titulo}" style="width: 300px;">
                    <p>${producto.descripcion}</p>
                    <p>Precio: $${producto.precio}</p>
                `;

                // Crear un contenedor para los botones
                const divBotones = document.createElement("div");

                // Botón para agregar al carrito
                const btnAgregar = document.createElement("button");
                btnAgregar.classList.add("button");
                btnAgregar.innerText = "Agregar al carrito";
                btnAgregar.addEventListener("click", () => {agregarAlCarrito(producto);
                mostrarToast(`Se agregó ${producto.titulo} al carrito`);
            });
                
                // Botón para volver
                const btnVerMas = document.createElement("button");
                btnVerMas.innerText = "Volver";
                btnVerMas.classList.add("button");
                btnVerMas.addEventListener("click", () => {
                    window.location.href = "/index.html"; // Verifica el nombre del archivo de destino
                });

                // Añadir los botones al contenedor
                divBotones.appendChild(btnAgregar);
                divBotones.appendChild(btnVerMas);

                // Añadir el contenedor de botones al contenedor del producto
                contenedorProducto.appendChild(divBotones);
                
            } else {
                contenedorProducto.innerHTML = "<p>Producto no encontrado.</p>";
            }
        })
        .catch((error) => {
            console.error("Error al cargar los detalles del producto:", error);
        });
});

// Función para agregar al carrito
function agregarAlCarrito(producto) {
    const carritoActual = obtenerCarritoDeLocalStorage();

    const productoExistente = carritoActual.find((p) => p.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carritoActual.push({ ...producto, cantidad: 1 });
    }

    guardarCarritoEnLocalStorage(carritoActual);

    console.log(`Producto agregado al carrito: ${producto.titulo}`);
}

// Almacenamiento local del carrito
const obtenerCarritoDeLocalStorage = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito"));
    return carrito ? carrito : [];
};

const guardarCarritoEnLocalStorage = (carrito) => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};
