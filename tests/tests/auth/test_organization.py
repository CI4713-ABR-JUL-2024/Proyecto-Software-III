from playwright.sync_api import Page, expect
from .test_register import login_with_user 
from ...models import User, Organization
from ...utils.fixtures import admin  # noqa: F401
from ...conf import page_home_url


def create_organization(page: Page, organization: Organization) -> None:
    page.get_by_text("Organizaciones").click()
    page.get_by_text("Crear organización").click()
    
    page.get_by_placeholder("Nombre de la organización").fill(organization.name)
    page.get_by_placeholder("País").fill(organization.country)
    page.get_by_placeholder("Estado").fill(organization.state)    
    page.get_by_placeholder("Responsable").fill(organization.responsible)
    page.get_by_placeholder("Teléfono").fill(organization.phone_number)
    page.get_by_placeholder("Correo electrónico").fill(organization.email)

    page.get_by_text("Crear", exact=True).click()


def test_create_organization(page: Page, admin: User):  # noqa: F811
    "Crea una organización"
    page.goto(f"{page_home_url}")
    login_with_user(page, admin)
    new_organization = Organization.create_fake()
    create_organization(page, new_organization)
    page.wait_for_timeout(500)
    # Buscar la organización en la lista
    page.get_by_placeholder("Buscar organización").fill(new_organization.email)
    page.locator("xpath=//div[./div/h3[text()='Organizaciones']]/div/div/button/*[name()='svg']").click()
    expect(page.locator("xpath=//tbody/tr")).to_have_count(2)
    

