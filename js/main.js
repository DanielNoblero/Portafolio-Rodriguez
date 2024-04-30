// Almacenamiento local del carrito
const obtenerCarritoDeLocalStorage = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito"));
    return carrito ? carrito : [];
};

const carrito = obtenerCarritoDeLocalStorage();

// Función para obtener datos de productos
const obtenerProductos = async () => {
    try {
        const respuesta = await fetch("data/productos.json");
        if (!respuesta.ok) throw new Error("Error al cargar productos");
        const productos = await respuesta.json();
        renderizarProductos(productos);
    } catch (error) {
        console.error(error);
        mostrarToast("Error al cargar productos");
    }
};

// Función para renderizar productos
const renderizarProductos = (productos) => {
    const contenedorProductos = document.querySelector("#productos");
    contenedorProductos.innerHTML = "";

    productos.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("row");
        div.innerHTML = `
            <h3>${producto.titulo}</h3>
            <img class="row-img" src="${producto.img}" alt="${producto.titulo}">
            <p class="row-p2">$${producto.precio}</p>
        `;

        const divBotones = document.createElement("div");
        divBotones.classList.add("botones");

        // Botón para agregar al carrito
        const btnAgregar = document.createElement("button");
        btnAgregar.classList.add("button");
        btnAgregar.innerText = "Agregar al carrito";
        btnAgregar.addEventListener("click", () => agregarAlCarrito(producto));
        divBotones.appendChild(btnAgregar);

        // Botón para ver más detalles
        const btnVerMas = document.createElement("button");
        btnVerMas.innerText = "Ver más";
        btnVerMas.classList.add("button");
        btnVerMas.addEventListener("click", () => {
            window.open(`./html/productos.html?id=${producto.id}`,`black`);
        });
        divBotones.appendChild(btnVerMas);
        div.appendChild(divBotones);
        contenedorProductos.appendChild(div);
    });
};

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

// Función para actualizar el carrito
const actualizarCarrito = () => {
    const carritoVacio = document.querySelector("#carrito-vacio");
    const carritoProductos = document.querySelector("#carrito-productos");
    const carritoTotal = document.querySelector("#carrito-total");
    const btnVacio = document.querySelector("#vaciar-carrito");

    localStorage.setItem("carrito", JSON.stringify(carrito));

    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        carritoTotal.innerText = "Total: $0";
        btnVacio.classList.add("d-none")
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        carritoProductos.innerHTML = "";
        btnVacio.classList.remove("d-none")

        carrito.forEach((producto) => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
            <h3>${producto.titulo}</h3>
            <p>$${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Subtotal: $${producto.precio * producto.cantidad}</p>
        `;

            const btnRestar = document.createElement("button");
            btnRestar.classList.add("carrito-producto-btn");
            btnRestar.innerText = "-";
            btnRestar.addEventListener("click", () => restarDelCarrito(producto));

            div.appendChild(btnRestar);

            const btnSumar = document.createElement("button");
            btnSumar.classList.add("carrito-producto-btn");
            btnSumar.innerText = "+";
            btnSumar.addEventListener("click", () => sumarAlCarrito(producto));

            div.appendChild(btnSumar);

            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("carrito-producto-btn");
            btnEliminar.innerText = "X";
            btnEliminar.addEventListener("click", () => borrarDelCarrito(producto));

            div.appendChild(btnEliminar);
            carritoProductos.appendChild(div);
        });

        const totalCarrito = calcularTotal();
        carritoTotal.innerText = `Total: $${totalCarrito}`;

        const botonPagar = document.createElement("button");
        botonPagar.innerText = "Pagar";
        botonPagar.classList.add("button", "boton-pagar");
        botonPagar.addEventListener("click", () => {
            window.location.href = '/html/checkout.html';
        });
        carritoTotal.appendChild(botonPagar);
    }
};

// Función para agregar un producto al carrito
const agregarAlCarrito = (producto) => {
    const itemEncontrado = carrito.find((item) => item.titulo === producto.titulo);
    if (itemEncontrado) {
        itemEncontrado.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();
    mostrarToast(`Se agregó ${producto.titulo} al carrito`);
};

// Función para eliminar un producto del carrito
const borrarDelCarrito = (producto) => {
    const indiceProducto = carrito.findIndex((item) => item.titulo === producto.titulo);
    if (indiceProducto !== -1) {
        carrito.splice(indiceProducto, 1);
        actualizarCarrito();
        mostrarToast(`Se eliminó ${producto.titulo} del carrito`);
    }
};

// Función para restar una cantidad del carrito
const restarDelCarrito = (producto) => {
    if (producto.cantidad > 1) {
        producto.cantidad--;
        mostrarToast(`Se quitó uno de ${producto.titulo}`);
    } else {
        borrarDelCarrito(producto);
    }
    actualizarCarrito();
};

// Función para sumar una cantidad al carrito
const sumarAlCarrito = (producto) => {
    producto.cantidad++;
    mostrarToast(`Se agregó uno más de ${producto.titulo}`);
    actualizarCarrito();
};

// Función para calcular el total del carrito
const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
};

// Vaciar el carrito con confirmación
const vaciarCarrito = () => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "button-confir",
            cancelButton: "button-cancel"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: '¿Estás seguro de que deseas vaciar el carrito?',
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciarlo",
        cancelButtonText: "No, cancelar",
        reverseButtons: true 
    }).then((result) => {
        if (result.isConfirmed) {
            
            carrito.length = 0;
            localStorage.removeItem("carrito");
            actualizarCarrito(); 
            mostrarToast("El carrito fue vaciado"); 

            swalWithBootstrapButtons.fire({
                title: "Vaciado",
                text: "El carrito se vació con éxito.",
                icon: "success"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "El carrito sigue intacto.",
                icon: "info"
            });
        }
    });
};


document.addEventListener("DOMContentLoaded", () => {
    obtenerProductos();
    actualizarCarrito();

    document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
});

document.addEventListener("DOMContentLoaded", () => {
    const elementoHora = document.getElementById("hora-local");
    const actualizarHora = () => {
        const fechaActual = new Date();
        const hora = fechaActual.toLocaleTimeString();
        elementoHora.innerText = `La hora local es: ${hora}`;
    };
    setInterval(actualizarHora, 1000);
    actualizarHora();
});

document.addEventListener("DOMContentLoaded", function() {
    const botonBajar = document.querySelector('.bajar');

    botonBajar.addEventListener('click', function(event) {
        event.preventDefault(); // Evita que el enlace recargue la página

        // Desplaza la página al final
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth' // Para que el desplazamiento sea suave
        });
    });
});
