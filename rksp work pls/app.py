from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from werkzeug.security import generate_password_hash, check_password_hash

# Инициализация приложения
app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
CORS(app)

# Модели базы данных
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('user', 'admin'), default='user')
    orders = db.relationship('Order', backref='user', lazy=True)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock_quantity = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255))
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.Enum('pending', 'processing', 'shipped', 'delivered', 'cancelled'), default='pending')
    shipping_address = db.Column(db.Text, nullable=False)
    payment_status = db.Column(db.Enum('pending', 'paid', 'failed'), default='pending')
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_at_time = db.Column(db.Numeric(10, 2), nullable=False)

# Пример простого маршрута для проверки
@app.route('/')
def index():
    return 'API работает!'

# API endpoints
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    # Проверяем наличие необходимых полей
    if not all(key in data for key in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400

    # Проверяем, не занят ли email или username
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 400

    # Создаем нового пользователя
    try:
        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            role='user'
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 