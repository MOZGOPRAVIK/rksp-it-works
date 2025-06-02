class Config:
    SECRET_KEY = 'your-secret-key-here'  # Замените на свой секретный ключ
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:123456@localhost/offroad_shop'  # Замените на свои данные для подключения
    SQLALCHEMY_TRACK_MODIFICATIONS = False 