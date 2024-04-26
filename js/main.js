const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch("../data/productos.json")
    .then(res => res.json())
    .then(data => renderizarProductos(data))
    .catch(error => console.error('Error al cargar los productos:', error));

    const contenedorProductos = document.querySelector("#productos");
    const carritoVacio = document.querySelector("#carrito-vacio");
    const carritoProductos = document.querySelector("#carrito-productos");
    const carritoTotal = document.querySelector("#carrito-total");

function renderizarProductos(productos) {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("row");
        div.innerHTML = `
            <h3>${producto.titulo}</h3>
            <img class="row-img" src="${producto.img}" alt="${producto.titulo}">
            <p class="row-p">${producto.descripcion}</p>
            <p class="row-p2">$${producto.precio}</p>
        `;
        
        const btn = document.createElement("button");
        btn.classList.add("button");
        btn.innerText = "Agregar al carrito";
        btn.addEventListener("click", () => agregarAlCarrito(producto));
        
        div.appendChild(btn);
        contenedorProductos.appendChild(div);
    });
}

function mostrarToast(mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: 'right',
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        className: "info"
    }).showToast();
}

function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        carritoTotal.innerText = "Total: $0";
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        carritoProductos.innerHTML = "";

        carrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.titulo}</h3>
                <p>$${producto.precio}</p>
                <p>Cant: ${producto.cantidad}</p>
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
            btnSumar.addEventListener("click", () => sumarDelCarrito(producto));
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
            window.location.href = './html/checkout.html'; 
        });
        carritoTotal.appendChild(botonPagar);
    }
}

function agregarAlCarrito(producto) {
    const itemEncontrado = carrito.find(item => item.titulo === producto.titulo);
    if (itemEncontrado) {
        itemEncontrado.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();
    mostrarToast(`Se agregó ${producto.titulo}`);
    
}

function borrarDelCarrito(producto) {
    const prodIndex = carrito.findIndex(item => producto.titulo === item.titulo);
    if (prodIndex !== -1) {
        carrito.splice(prodIndex, 1);
        actualizarCarrito();
    }
}

function restarDelCarrito(producto) {
    if (producto.cantidad > 1) {
        producto.cantidad--;
    } else {
        borrarDelCarrito(producto);
    }
    actualizarCarrito();
    mostrarToast(`Se restó ${producto.titulo}`);
}

const sumarDelCarrito = (producto) =>{
    producto.cantidad++;
    actualizarCarrito();
    mostrarToast(`Se agregó ${producto.titulo}`);
}

function calcularTotal() {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos();
    actualizarCarrito();


    
    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        carrito.length = 0;
        localStorage.removeItem("carrito"); 
        actualizarCarrito(); 
    });
});
