from playwright.sync_api import Page, expect
from .test_register import login_with_user 
from ...models.user import User
from ...utils.fixtures import admin  # noqa: F401
from ...conf import page_home_url

def test_check_profiles(page: Page, admin: User):  # noqa: F811
    "Buscan en la vista de perfiles al usuario admin logeado"
    page.goto(f"{page_home_url}")
    login_with_user(page, admin)

    page.get_by_text("Perfiles de Usuarios").click()

    search_bar = page.get_by_placeholder("Buscar usuario")
    expect(search_bar).to_be_visible()
    # TODO: Usar la barra de busqueda para encontrar al usuario
    # actual

def test_create_user_in_profiles(page: Page, admin: User):  # noqa: F811
    "Crea un usuario en la vista de perfiles"
    page.goto(f"{page_home_url}")
    login_with_user(page, admin)
    page.get_by_text("Perfiles de Usuarios").click()
    page.get_by_text("Crear Usuario").click()
    
    new_user = User.create_fake()
    new_user.password = "12345678" # Contraseña por defecto
    page.get_by_placeholder("Correo").fill(new_user.email)
    page.get_by_placeholder("Nombre").fill(new_user.first_name)
    page.get_by_placeholder("Apellido").fill(new_user.last_name)
    page.locator("xpath=//select[@id='role']").select_option("account_analyst")
    page.get_by_placeholder("Teléfono").fill(new_user.phone_number)
    page.get_by_text("Crear", exact=True).click()
    # TODO: Usar la barra de busqueda para encontrar al usuario
    # recien agregado y garantizar que ha sido creado

    page.get_by_text("Cerrar Sesión").click()
    login_with_user(page, new_user)



