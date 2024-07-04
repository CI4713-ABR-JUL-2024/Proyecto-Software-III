from playwright.sync_api import Page
from .test_register import login_with_user 
from ...models import User, Approach
from ...utils.fixtures import admin  # noqa: F401
from ...conf import page_home_url


def create_approach(page: Page, approach: Approach) -> None:
    page.get_by_text("Proyectos").click()   
    page.get_by_text("Modificar abordajes").click()
    page.get_by_text("Agregar").click()

    page.get_by_placeholder("Nuevo tipo de abordaje").fill(approach.name)
    page.get_by_text("Guardar").click()
    page.reload()

def test_create_approach(page: Page, admin: User):  # noqa: F811
    "Crear un abordaje"
    page.goto(f"{page_home_url}")
    login_with_user(page, admin)
    new_approach = Approach.create_fake()
    create_approach(page, new_approach)
    page.wait_for_timeout(500)
    
def test_remove_approach(page: Page, admin: User):  # noqa: F811
    "Eliminar un abordaje"
    page.goto(f"{page_home_url}")
    login_with_user(page, admin)
    new_approach = Approach.create_fake()
    create_approach(page, new_approach)
    page.get_by_text("Modificar abordajes").click()
    page.get_by_role("button", name="Eliminar", exact=True).last.click()
    page.get_by_text("Eliminar", exact=True).click()
    page.reload()
    page.get_by_text("Modificar abordajes").click()
    page.wait_for_timeout(500)
    
def test_edit_approach(page: Page, admin: User):  # noqa: F811
    "Edita un abordaje"
    page.goto(f"{page_home_url}")
    login_with_user(page, admin)
    new_approach = Approach.create_fake()    
    create_approach(page, new_approach)
    edited_approach = Approach.create_fake()
    page.get_by_text("Modificar abordajes").click()
    page.get_by_role("button", name="Editar", exact=True).first.click()
    page.get_by_placeholder("Editar tipo de abordaje").fill(edited_approach.name)
    page.get_by_role("button", name="Listo").click()
    page.reload()
    page.get_by_text("Modificar abordajes").click()
    page.wait_for_timeout(500)