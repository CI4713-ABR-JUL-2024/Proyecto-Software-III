from dataclasses import dataclass
from faker import Faker
from random import randint
from .organization import Organization
from .approach import Approach


@dataclass
class Project:
    quarter: str
    year: int
    organization: Organization
    approach: Approach
    area: str

    @staticmethod
    def create_fake(organization: Organization, approach: Approach) -> 'Project':
        faker = Faker()
        quarter = "enero-marzo"
        year = randint(2000, 2024)
        area = faker.sentence(randint(1, 3)).replace(".", "")
        return Project(
            quarter=quarter,
            year=year,
            organization=organization,
            approach=approach,
            area=area,
        )
