const socket = io();

socket.on('productsUpdated', products => {
    const list = document.getElementById('productList');
    list.innerHTML = '';

    products.forEach(p => {
        list.innerHTML += `
        <li>
            ${p.title} - $${p.price}
            <button onclick="deleteProduct('${p._id}')">❌</button>
        </li>`;
    });
});

socket.on('userConnected', () => {
    Swal.fire({
        title: '👋 Nuevo usuario conectado',
        text: 'Alguien entró a la vista en tiempo real',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
    });
});

socket.on('productAdded', () => {
    Toastify({
        text: "✅ Producto agregado",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50"
    }).showToast();
});

socket.on('productDeleted', () => {
    Toastify({
        text: "🗑️ Producto eliminado",
        duration: 2500,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336"
    }).showToast();
});


function addProduct() {

    const titleInput = document.getElementById('title');
    const priceInput = document.getElementById('price');

    const title = titleInput.value;
    const price = priceInput.value;

    socket.emit('addProduct', { title, price });

    titleInput.value = '';
    priceInput.value = '';

}

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}