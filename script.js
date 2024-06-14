const API_URL = 'https://striveschool-api.herokuapp.com/api/product/';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZiZjE1MTdjMjM5YzAwMTUyZjRiMzQiLCJpYXQiOjE3MTgzNTAxNjEsImV4cCI6MTcxOTU1OTc2MX0.wTG4TGse1FuY3v8TYdTNEoXglfvAW4ovPnoyqiKVtsk'

document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const product = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        brand: document.getElementById('brand').value,
        imageUrl: document.getElementById('imageUrl').value,
        price: document.getElementById('price').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(product)
        });
        const data = await response.json();
        console.log('Prodotto creato:', data);
        loadProducts();
    } catch (error) {
        showError('Errore nella creazione del prodotto. Per favore riprova.');
        console.error('Errore:', error);
    }
});

document.getElementById('product-form').addEventListener('reset', (e) => {
    if (!confirm('Sei sicuro di voler resettare il form?')) {
        e.preventDefault();
    }
});

async function loadProducts() {
    try {
        document.getElementById('loading-spinner').classList.remove('d-none');
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        });
        const products = await response.json();
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('col-md-4', 'product-item');
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>${product.brand}</p>
                <p>${product.price} €</p>
                <img src="${product.imageUrl}" alt="${product.name}" class="img-fluid">
                <button class="btn btn-primary" onclick="editProduct('${product._id}')">Modifica</button>
                <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Cancella</button>
            `;
            productsList.appendChild(productItem);
        });
    } catch (error) {
        showError('Errore nel caricamento dei prodotti. Per favore riprova.');
        console.error('Errore:', error);
    } finally {
        document.getElementById('loading-spinner').classList.add('d-none');
    }
}

async function editProduct(productId) {
    const product = {
        name: prompt('Inserisci il nuovo nome:'),
        description: prompt('Inserisci la nuova descrizione:'),
        brand: prompt('Inserisci la nuova marca:'),
        imageUrl: prompt('Inserisci il nuovo URL immagine:'),
        price: prompt('Inserisci il nuovo prezzo:')
    };

    try {
        const response = await fetch(`${API_URL}${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(product)
        });
        const data = await response.json();
        console.log('Prodotto modificato:', data);
        loadProducts();
    } catch (error) {
        showError('Errore nella modifica del prodotto. Per favore riprova.');
        console.error('Errore:', error);
    }
}

async function deleteProduct(productId) {
    if (!confirm('Sei sicuro di voler cancellare questo prodotto?')) {
        return;
    }

    try {
        await fetch(`${API_URL}${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        });
        console.log('Prodotto cancellato');
        loadProducts();
    } catch (error) {
        showError('Errore nella cancellazione del prodotto. Per favore riprova.');
        console.error('Errore:', error);
    }
}

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
    setTimeout(() => {
        errorMessage.classList.add('d-none');
    }, 5000);
}

// Carica i prodotti quando la pagina è caricata
window.onload = loadProducts;
