from playwright.sync_api import Page, expect
from .test_projects import create_project
from .test_register import login_with_user 
from ...models import User, Objective
from ...utils.fixtures import admin, leader  # noqa: F401
from ...conf import page_home_url


def create_granular_objective(page: Page, objective: Objective) -> None:
    page.get_by_role("button", name="Crear Objetivo").click()
    page.get_by_placeholder("Nombre del objetivo").fill(objective.name)
    page.get_by_text("Crear", exact=True).click()
    page.wait_for_timeout(500)
    page.reload()

def create_objective(page: Page, leader: User, admin: User) -> Objective:
    "Crea un objetivo"
    page.goto(f"{page_home_url}")
    login_with_user(page, admin)
    create_project(page)
    page.get_by_text("Cerrar Sesión").click()

    login_with_user(page, leader)
    page.goto(f"{page_home_url}/projects")
    page.locator("xpath=//tbody//tr[2]//button[1]/*[name()='svg']").click()
    new_element = Objective.create_fake()
    create_granular_objective(page, new_element)
    page.wait_for_timeout(500)
    return new_element

def test_create_objective(page: Page, leader: User, admin: User):  # noqa: F811
    create_objective(page, leader, admin)

def test_delete_objective(page: Page, leader: User, admin: User):  # noqa: F811
    "Eliminar un objetivo"
    create_objective(page, leader, admin)
    page.reload()
    page.wait_for_timeout(1000)