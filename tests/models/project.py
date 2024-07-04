from dataclasses import dataclass
from faker import Faker
from random import randint
from . import Organization, Approach


@dataclass
class Project:
    quarter: int
    year: int
    organization: Organization
    approach: Approach
    area: str

    @staticmethod
    def create_fake(organization: Organization, approach: Approach) -> 'Project':
        faker = Faker()
        quarter = randint(1, 4)
        year = randint(2000, 2024)
        area = faker.sentence(randint(1, 3))
        return Project(
            quarter=quarter,
            year=year,
            organization=organization,
            approach=approach,
            area=area,
        )
