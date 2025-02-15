let catalogo = '';

function cargarProductos() {
    fetch('php/todos_productos.php')
        .then(response => response.json())
        .then(productos => {
            const contenedor = document.getElementById('items');
            contenedor.innerHTML = '';
            catalogo = productos;
            
            productos.forEach(producto => {
                const tarjetaProducto = document.createElement('div');
                tarjetaProducto.className = 'producto';
                tarjetaProducto.innerHTML = `
                        <div><span>${producto.nombre}</span></div>
                        <img class="card-image" src="img/${producto.foto}" alt="${producto.nombre}">
                        <span>${producto.precio}€</span>
                        <div>
                            <input type="number" class="unidades" value="1" id="input-${producto.id}">
                            <button onclick="agregarAlCarrito(${producto.id})">+</button>
                        </div>
                `;
                contenedor.appendChild(tarjetaProducto);

            });
        })
        .catch(error => console.error('Error:', error));
}

function agregarAlCarrito(id) {
    const producto = catalogo.find(producto => producto.id == id); // Buscar en catalogo el id que coincida con el id del parámetro
    unidades = parseInt(document.getElementById(`input-${id}`).value); // Lo pasamos a INT para que no concatene

    let carrito = JSON.parse(localStorage.getItem('Carrito')) || [];
    let item = {...producto, cantidad: unidades};

    let isInCarrito = carrito.find(producto => producto.id == id); // Buscar en localStorage el id que coincida con el id del parámetro
    if (isInCarrito) {
        isInCarrito.cantidad += unidades;
    } else {
        carrito.push(item);
    }

    localStorage.setItem('Carrito', JSON.stringify(carrito));
    mostrarCarrito()
}

function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem('Carrito')) || [];

    let isInCarrito = carrito.find(producto => producto.id == id); // Buscar en localStorage el id que coincida con el id del parámetro
    if (isInCarrito) carrito = carrito.filter(producto => producto.id != id); // Mostramos solo los que NO coincidan con el id
    localStorage.setItem('Carrito', JSON.stringify(carrito));

    if (carrito.length === 0) vaciarCarrito();
    mostrarCarrito()
}

function mostrarCarrito(){
    let carrito = JSON.parse(localStorage.getItem('Carrito')) || false;
    let lista = document.getElementById('lista-carrito');
    let preciototal = document.getElementById('total');

    if (carrito){
        let total = 0;
        lista.innerText = '';
        carrito.forEach(item => {
            let producto = document.createElement('li')
            producto.innerHTML = `${item.nombre} - ${item.cantidad} ud x ${item.precio} € <button onclick="eliminarDelCarrito(${item.id})">X</button>`
            lista.appendChild(producto);
            total += (item.precio * item.cantidad);
        });
        preciototal.innerText = Math.round(total * 100) / 100;
    } else {
        lista.innerText ='Carrito vacío';
    }
}

function vaciarCarrito(){
    localStorage.removeItem('Carrito');
    mostrarCarrito();
    document.getElementById('total').innerText = '0';    
}

function tramitarCarrito(){
    let carr = JSON.parse(localStorage.getItem('Carrito')) || false;
    if (carr){
        let respuesta = confirm("👍🏼 Vamos a proceder a tramitar su pedido");
        if (respuesta) {
            let formData = new FormData();
            formData.append("carrito", JSON.stringify(carr));
    
            fetch('php/tramito_carrito.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data == 'ok') {
                    alert('😁 Pedido tramitado');
                    vaciarCarrito();
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert("❌ Pedido cancelado, ¡quizá en otro momento!");
        }
    } else alert('⚠️ No hay pedido que tramitar')
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('total').innerText = '0';  
    document.getElementById('borrar').addEventListener('click', vaciarCarrito);
    document.getElementById('tramitar').addEventListener('click', tramitarCarrito);
    cargarProductos();
    mostrarCarrito();
});

