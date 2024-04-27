document.addEventListener("DOMContentLoaded", () => {
    const contenedorProducto = document.querySelector("#producto-detalle");

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Obtener el ID desde la URL

    fetch("../data/productos.json")
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
            } else {
                contenedorProducto.innerHTML = "<p>Producto no encontrado.</p>";
            }
        })
        .catch((error) => {
            console.error("Error al cargar los detalles del producto:", error);
        });
});