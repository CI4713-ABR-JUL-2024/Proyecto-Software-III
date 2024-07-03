from playwright.sync_api import Page, expect
from .test_register import login_with_user 
from ...models import User, Organization
from ...utils.fixtures import admin  # noqa: F401
from ...conf import page_home_url


def create_organization(organization: Organization) -> None:
    pass

def test_create_organization(page: Page, admin: User):  # noqa: F811
    "Crea una organización"
    page.goto(f"{page_home_url}")
    login_with_user(page, admin)
    page.get_by_text("Organizaciones").click()
    page.get_by_text("Crear organización").click()
    page.pause()

