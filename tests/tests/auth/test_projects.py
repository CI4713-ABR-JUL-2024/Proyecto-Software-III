from playwright.sync_api import Page, expect
from .test_register import login_with_user 
from ...models import User, Organization, Project, Approach
from ...utils.fixtures import admin  # noqa: F401
from ...conf import page_home_url
from .test_organization import create_organization
from .test_approach import create_approach


def create_project(page: Page) -> Project:
    organizations = [Organization.create_fake() for _ in range(2)]
    for organization in organizations:
        create_organization(page, organization)
        page.goto(f"{page_home_url}/projects")

    approachs = [Approach.create_fake() for _ in range(2)]
    for approach in approachs:
        create_approach(page, approach)
        page.goto(f"{page_home_url}/projects")

    project = Project.create_fake(organizations[-1], approachs[-1])
    granular_create_project(page, project)
    page.wait_for_timeout(500)
    return project

def granular_create_project(page: Page, project: Project) -> None:
    page.get_by_text("Proyectos", exact=True).click()
    page.get_by_text("Crear Proyecto").click()
    
    page.get_by_placeholder("Trimestre").fill(project.quarter)    
    page.get_by_placeholder("Año").fill(str(project.year))
    page.locator("#organization").select_option(label=project.organization.name)
    page.locator("#approach").select_option(label=project.approach.name)
    page.get_by_placeholder("Área").fill(project.area)
    page.get_by_text("Crear", exact=True).click()


def test_create_project(page: Page, admin: User):  # noqa: F811
    "Crear un proyecto"
    page.goto(page_home_url)
    login_with_user(page, admin)
    project = create_project(page)
    page.reload()
    page.get_by_placeholder("Buscar proyecto").fill(project.area)
    page.locator("xpath=//div[./div/h3[text()='Portafolio de Proyetos de OKRs']]/div/div/button/*[name()='svg']").click()
    expect(page.locator("xpath=//tbody/tr")).to_have_count(2)
    

def test_delete_project(page: Page, admin: User):  # noqa: F811
    "Eliminar un proyecto"
    page.goto(page_home_url)
    login_with_user(page, admin)
    project = create_project(page)
    page.reload()
    page.get_by_placeholder("Buscar proyecto").fill(project.area)
    page.locator("xpath=//div[./div/h3[text()='Portafolio de Proyetos de OKRs']]/div/div/button/*[name()='svg']").click()    
    expect(page.locator("xpath=//tbody/tr")).to_have_count(2)

    page.get_by_role("button", name="Eliminar").click()
    page.wait_for_timeout(500)
    page.reload()

    page.get_by_placeholder("Buscar proyecto").fill(project.area)
    page.locator("xpath=//div[./div/h3[text()='Portafolio de Proyetos de OKRs']]/div/div/button/*[name()='svg']").click()    
    expect(page.locator("xpath=//tbody/tr")).to_have_count(1)