// Функция для получения корзины из localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Функция для сохранения корзины в localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Функция для добавления товара в корзину
function addToCart(productId, name, price, image) {
    const cart = getCart();
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification('Товар добавлен в корзину');
}

// Функция для удаления товара из корзины
function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.productId !== productId);
    saveCart(updatedCart);
    updateCartUI();
}

// Функция для изменения количества товара в корзине
function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            // Если количество 0 или меньше, удаляем товар
            return removeFromCart(productId);
        }
    }
    
    saveCart(cart);
    updateCartUI();
}

// Функция для обновления счетчика товаров в корзине
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'inline' : 'none';
    });
}

// Функция для показа уведомления
function showNotification(message) {
    // Проверяем, существует ли уже контейнер для уведомлений
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notificationContainer.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.remove();
        if (notificationContainer.children.length === 0) {
            notificationContainer.remove();
        }
    }, 3000);
}

// Функция для обновления UI корзины
function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    const cart = getCart();
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        return;
    }

    let totalSum = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        totalSum += itemTotal;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price">${item.price.toLocaleString()} руб.</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.productId})">✕</button>
            </div>
        `;
    }).join('');

    // Добавляем итоговую сумму
    cartItemsContainer.innerHTML += `
        <div class="cart-total">
            <h3>Итого: ${totalSum.toLocaleString()} руб.</h3>
            <button class="checkout-btn" onclick="checkout()">Оформить заказ</button>
        </div>
    `;
}

// Функция для оформления заказа
function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('Корзина пуста');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Здесь будет логика оформления заказа
    showNotification('Функция оформления заказа в разработке');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartUI();
}); 