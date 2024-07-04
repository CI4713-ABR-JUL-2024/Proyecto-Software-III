from playwright.sync_api import Page, expect
from .test_register import login_with_user 
from ...models import User, Project
from ...utils.fixtures import admin  # noqa: F401
from ...conf import page_home_url


# def create_project(page: Page, project: Project) -> None:
#     page.get_by_text("Proyectos").click()
#     page.get_by_text("Crear Proyecto").click()
    
#     page.get_by_placeholder("Nombre de la organización").fill(project.name)
#     page.get_by_placeholder("País").fill(project.country)
#     page.get_by_placeholder("Estado").fill(project.state)    
#     page.get_by_placeholder("Responsable").fill(project.responsible)
#     page.get_by_placeholder("Teléfono").fill(project.phone_number)
#     page.get_by_placeholder("Correo electrónico").fill(project.email)

#     page.get_by_text("Crear", exact=True).click()


# def test_create_project(page: Page, admin: User):  # noqa: F811
#     "Crear un proyecto"
#     page.goto(f"{page_home_url}")
#     login_with_user(page, admin)
#     new_project = Project.create_fake()
#     create_project(page, new_project)
#     page.wait_for_timeout(500)

    # page.get_by_placeholder("Buscar organización").fill(new_organization.email)
    # page.locator("xpath=//div[./div/h3[text()='Organizaciones']]/div/div/button/*[name()='svg']").click()
    # expect(page.locator("xpath=//tbody/tr")).to_have_count(2)

