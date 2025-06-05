// Функция для проверки авторизации
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    return true;
}

// Функция для получения данных пользователя
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Функция для выхода из системы
function logout() {
    const token = localStorage.getItem('token');
    
    // Очищаем локальное хранилище сразу
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Отправляем запрос на сервер для выхода
    fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Logout failed');
        }
        return response.json();
    })
    .then(() => {
        // Перенаправляем на страницу входа
        window.location.href = 'login.html';
    })
    .catch(error => {
        console.error('Logout error:', error);
        // В случае ошибки все равно перенаправляем на страницу входа
        window.location.href = 'login.html';
    });
}

// Функция для обновления UI в зависимости от статуса авторизации
function updateAuthUI() {
    const isAuthenticated = checkAuth();
    const user = getCurrentUser();
    
    // Находим все элементы, которые нужно показывать/скрывать
    const authButtons = document.querySelectorAll('.auth-buttons');
    const userInfo = document.querySelectorAll('.user-info');
    
    if (isAuthenticated && user) {
        // Показываем информацию о пользователе
        userInfo.forEach(element => {
            element.style.display = 'block';
            if (element.querySelector('.username')) {
                element.querySelector('.username').textContent = user.username;
            }
        });
        
        // Скрываем кнопки входа/регистрации
        authButtons.forEach(element => {
            element.style.display = 'none';
        });
    } else {
        // Скрываем информацию о пользователе
        userInfo.forEach(element => {
            element.style.display = 'none';
        });
        
        // Показываем кнопки входа/регистрации
        authButtons.forEach(element => {
            element.style.display = 'block';
        });
    }
}

// Вызываем функцию обновления UI при загрузке страницы
document.addEventListener('DOMContentLoaded', updateAuthUI); 