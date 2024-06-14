import os
import pytest
import psycopg2
from playwright.sync_api import Page, expect
from ...models.user import User, create_fake_user
from .test_register import login_with_user 

page_home_url = "http://localhost:3000"

@pytest.fixture
def admin():
    # Conectarse a la BD
    con = psycopg2.connect(
        dbname="db", user="postgres", password="1234", host="localhost", port="5432"
    )
    cur = con.cursor()

    # Crear el usuario admin
    user = create_fake_user()
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


def test_check_profiles(page: Page, admin: User):
    "Buscan en la vista de perfiles al usuario admin logeado"
    page.goto(f"{page_home_url}")
    login_with_user(page, admin)

    profiles_button = page.get_by_text("Perfiles de Usuarios")
    expect(profiles_button).to_be_visible()
    profiles_button.click()

    search_bar = page.get_by_placeholder("Buscar usuario")
    expect(search_bar).to_be_visible()
    # TODO: Usar la barra de busqueda para encontrar al usuario
    # actual

def test_create_user_in_profiles(page: Page, admin: User):
    "Crea un usuario en la vista de perfiles"
    page.goto(f"{page_home_url}")
    login_with_user(page, admin)
    profiles_button = page.get_by_text("Perfiles de Usuarios")
    expect(profiles_button).to_be_visible()
    profiles_button.click()

    page.get_by_text("Crear Usuario").click()
    new_user = create_fake_user()
    new_user.password = "12345678" # Contraseña por defecto
    page.get_by_placeholder("Correo").fill(new_user.email)
    page.get_by_placeholder("Nombre").fill(new_user.first_name)
    page.get_by_placeholder("Apellido").fill(new_user.last_name)
    page.locator("xpath=//select[@id='role']").select_option("account_analyst")
    page.get_by_placeholder("Teléfono").fill(new_user.phone_number)
    page.get_by_text("Crear", exact=True).click()
    # TODO: Usar la barra de busqueda para encontrar al usuario
    # recien agregado y garantizar que ha sido creado

    page.get_by_text("Cerrar Sesion").click()
    login_with_user(page, new_user)



