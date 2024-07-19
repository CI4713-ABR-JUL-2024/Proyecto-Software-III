from playwright.sync_api import Page
from .test_objective import create_objective
from ...utils.fixtures import admin, leader
from ...models import User, Initiative


def test_create_initiative(page: Page, leader: User, admin: User):  # noqa: F811
    "Crea una iniciativa"

    create_objective(page, leader, admin)
    page.get_by_role("button", name="Agregar").first.click()
    page.get_by_role("button", name="Iniciativas", exact=True).click()
    page.get_by_role("button", name="Agregar").click()
    page.get_by_placeholder("Nuevo tipo de iniciativa").fill(Initiative.create_fake().name)
    page.get_by_role("button", name="Guardar").click()
    page.wait_for_timeout(500)
    page.reload()
    page.get_by_role("button", name="Iniciativas", exact=True).click()
    page.wait_for_timeout(500)
    

def test_delete_initiative(page: Page, leader: User, admin: User):  # noqa: F811
    "Crea una iniciativa"

    create_objective(page, leader, admin)
    page.get_by_role("button", name="Agregar").first.click()
    page.get_by_role("button", name="Iniciativas", exact=True).click()
    page.get_by_role("button", name="Agregar").click()
    page.get_by_placeholder("Nuevo tipo de iniciativa").fill(Initiative.create_fake().name)
    page.get_by_role("button", name="Guardar").click()
    page.wait_for_timeout(500)
    page.reload()
    page.get_by_role("button", name="Iniciativas", exact=True).click()
    page.wait_for_timeout(500)
    page.locator("xpath=//div[contains(@class, 'Modal')]//tbody//tr[last()]//button[last()]").click()
    page.get_by_text("Eliminar", exact=True).click()
    page.reload()
    page.get_by_role("button", name="Iniciativas", exact=True)
    page.wait_for_timeout(500)

