from playwright.sync_api import Page, expect
from ...models.user import User


page_home_url = "http://localhost:3000"


def login_with_user(page: Page, user: User, close_session: bool = False) -> None:
    page.goto(f"{page_home_url}")
    page.locator("#email").fill(user.email)
    page.locator("#password").fill(user.password)
    page.get_by_text("Iniciar sesión").click()

    # Comprobar que se ha redirecionado al perfil del usuario
    expect(page).to_have_url(f"{page_home_url}/profile")
    expect(page.get_by_text(user.email)).to_be_visible(timeout=15000)

    if close_session:
        page.get_by_text("Cerrar Sesion").click()


def register_user(
    page: Page,
    user: User,
    remember_current_page: bool = False,
    check_login: bool = True,
) -> None:
    saved_page = None
    if remember_current_page:
        saved_page = page.url

    page.goto(f"{page_home_url}/register")

    # Llenar los campos del form
    page.locator("#name").fill(user.first_name)
    page.locator("#last_Name").fill(user.last_name)
    page.locator("#email").fill(user.email)
    page.locator("#password").fill(user.password)
    page.locator("#confirmPass").fill(user.password)
    page.locator("#telephone").fill(user.phone_number)
    page.get_by_text("Crear cuenta").click()

    # Comprobar el registro exitoso
    expect(page.get_by_text("¡Registro exitoso!")).to_be_visible(timeout=15000)

    if check_login:
        login_with_user(page, user, close_session=True)

    if saved_page:
        page.goto(saved_page)


def change_password(page: Page, user: User, close_session: bool = False) -> None:
    page.goto(f"{page_home_url}/change")
    page.locator("xpath=//input[@name='oldPassword']").fill(user.password)
    # Se cambia la contraseña a la misma pero revertida
    user.password = user.password[::-1]
    page.locator("xpath=//input[@name='newPassword']").fill(user.password)
    page.locator("xpath=//input[@name='compareNewPassword']").fill(user.password)
    page.get_by_text("Cambiar contraseña").click()
    expect(page.get_by_text("Actualización exitosa")).to_be_visible()
    page.goto(f"{page_home_url}/profile")
    if close_session:
        page.get_by_text("Cerrar Sesion").click()


def test_register_user(page: Page):
    "Prueba el registro de usuarios en el sistema"
    user = User.create_fake()
    register_user(page, user)


def test_change_password(page: Page):
    user = User.create_fake()
    register_user(page, user)
    login_with_user(page, user)    
    change_password(page, user, close_session=True)
    login_with_user(page, user)