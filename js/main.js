function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
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

            const btn = document.createElement("button");
            btn.classList.add("carrito-producto-btn");
            btn.innerText = "X";
            btn.addEventListener("click", () => borrarDelCarrito(producto));
            div.appendChild(btn);

            carritoProductos.appendChild(div);
        });
        
        // Calcular y mostrar el total del carrito
        const totalCarrito = calcularTotal();
        carritoTotal.innerText = `Total: $${totalCarrito}`;
    }
}
