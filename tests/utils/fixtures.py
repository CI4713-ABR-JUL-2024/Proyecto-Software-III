import pytest
import psycopg2
from ..models.user import User

@pytest.fixture
def admin():
    # Conectarse a la BD
    con = psycopg2.connect(
        dbname="db", user="postgres", password="1234", host="localhost", port="5432"
    )
    cur = con.cursor()

    # Crear el usuario admin
    user = User.create_fake()
    user.password = "12345678"

    cur.execute(
    f"""
    INSERT INTO public."User"
        ("name", last_name, email, "password", telephone, role_name)
        VALUES
        (
            '{user.first_name}', 
            '{user.last_name}', 
            '{user.email}', 
            '$2b$10$rTdR9c0EfqT0QlqZDdzgMOGPWvTeEve1IrLE/4Sefj4VefYSJd/4q', 
            '{user.phone_number}', 
            'admin'
        )"""
    )
    con.commit()
    con.close()
    
    return user