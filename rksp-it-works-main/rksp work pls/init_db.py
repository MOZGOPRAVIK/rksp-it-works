from app import db, app

def init_database():
    with app.app_context():
        # Создаем все таблицы
        db.create_all()
        print("Database tables created successfully!")

if __name__ == '__main__':
    init_database() 