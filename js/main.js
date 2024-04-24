const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productos = [
    {
        titulo: "Pasta",
        precio: 500,
        descripcion: "Una pasta con salsa es un plato clásico y reconfortante, compuesto por fideos cocidos al dente, como spaghetti o penne, generosamente bañados en una salsa rica y sabrosa. Las opciones de salsa varían desde una tradicional marinara, cargada de tomates frescos y hierbas aromáticas, hasta una cremosa salsa Alfredo con un toque suave de ajo y queso parmesano. Este plato se puede personalizar con adiciones como albóndigas, verduras asadas o mariscos, convirtiéndolo en una comida versátil y satisfactoria",
        img: "./multimedia/pasta.jpg"
    }, 
    {
        titulo: "Pizza",
        precio: 600,
        descripcion:" Una pizza casera típica consiste en una base de masa crujiente y esponjosa, recién horneada, cubierta con una salsa de tomate rica y aromática. Sobre esta base se esparcen generosamente queso mozzarella derretido y dorado, y se complementa con ingredientes al gusto como rodajas de pepperoni, champiñones frescos, pimientos, albahaca, tomate fresco y cebolla. Este platillo es apreciado por su frescura y la posibilidad de personalizar los toppings según las preferencias de cada uno.",
        img: "./multimedia/pizza.jpg"
    }, 
    {
        titulo: "Pollo",
        precio: 450,
        descripcion:"Las patas de pollo al horno son un plato sencillo y delicioso, ideal para una comida reconfortante. Este plato consiste en patas de pollo marinadas en una mezcla de especias, hierbas y a veces un toque de jugo de limón o ajo, que luego se hornean hasta alcanzar una piel dorada y crujiente mientras el interior permanece jugoso y tierno. Las patas de pollo al horno se pueden servir con una variedad de guarniciones, como verduras asadas, puré de papas o una ensalada fresca, haciendo de esta receta una opción versátil para cualquier ocasión.",
        img: "./multimedia/pollo.jpg"
    }, 
    {
        titulo: "Tacos",
        precio: 400,
        descripcion:"Los tacos son un platillo mexicano popular que consiste en tortillas pequeñas, típicamente de maíz, rellenas de una variedad de ingredientes. Los rellenos clásicos incluyen carne asada, pollo, pescado, o carnitas, acompañados de cebolla, cilantro, y salsa fresca. Se pueden añadir otros complementos como guacamole, queso, o frijoles refritos. Los tacos destacan por su sabor intenso y su capacidad de personalización, siendo un alimento básico tanto en eventos informales como en comidas familiares.",
        img: "./multimedia/tacos.jpg"
    }, 
    {
        titulo: "Tapas",
        precio: 350,
        descripcion:"Las tapas gallegas son una exquisita selección de pequeños platos y aperitivos originarios de Galicia, en el noroeste de España. Se caracterizan por su diversidad y riqueza, incorporando productos del mar y del campo gallegos, destacando ingredientes como mariscos frescos, carnes curadas y quesos locales. Estas tapas no solo son deliciosas sino también una parte esencial de la cultura gastronómica gallega, ofreciendo una experiencia culinaria que invita a compartir y disfrutar en buena compañía.",
        img: "./multimedia/tapas.jpg"
    },
    {
        titulo: "Empandas",
        precio: 300,
        descripcion:" Las empanadas son un tipo de pastelillo relleno que se puede encontrar en diversas culturas alrededor del mundo, pero son especialmente populares en Latinoamérica, España y Filipinas. Consisten en una masa exterior, que puede ser de harina de trigo o maíz, rellena con una variedad de ingredientes que varían según la región. Los rellenos típicos incluyen carne, pollo, queso, vegetales o mariscos, a menudo acompañados de cebolla, huevo duro, aceitunas y especias. Las empanadas se pueden hornear o freír.",
        img: "./multimedia/Empandas.jpg"
    }
];

const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");

function renderizarProductos() {
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
            window.location.href = '../html/checkout.html'; // Cambia 'checkout.html' al archivo que desees
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

    Toastify({
        text: `Se agregó ${producto.titulo}`,
        duration: 3000,  // Duración en milisegundos
        close: true,     // Muestra un botón para cerrar el toast
        gravity: "bottom",  // `top` o `bottom`
        position: 'right', // `left`, `center` o `right`
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        className: "info"
    }).showToast();
    
}

function borrarDelCarrito(producto) {
    const prodIndex = carrito.findIndex(item => item.titulo === producto.titulo);
    if (prodIndex !== -1) {
        if (carrito[prodIndex].cantidad > 1) {
            carrito[prodIndex].cantidad--;
        } else {
            carrito.splice(prodIndex, 1);
        }
        actualizarCarrito();
    }
}

const restarDelCarrito = (producto) =>{
    if (producto.cantidad ===1){
        borrarDelCarrito(producto);
    } else {
    producto.cantidad--;
    }
    actualizarCarrito();

    Toastify({
        text: `Se resto ${producto.titulo}`,
        duration: 3000,  // Duración en milisegundos
        close: true,     // Muestra un botón para cerrar el toast
        gravity: "bottom",  // `top` o `bottom`
        position: 'right', // `left`, `center` o `right`
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        className: "info"
    }).showToast();
}

const sumarDelCarrito = (producto) =>{
    producto.cantidad++;
    actualizarCarrito();

    Toastify({
        text: `Se agregó ${producto.titulo}`,
        duration: 3000,  // Duración en milisegundos
        close: true,     // Muestra un botón para cerrar el toast
        gravity: "bottom",  // `top` o `bottom`
        position: 'right', // `left`, `center` o `right`
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        className: "info"
    }).showToast();
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
