from dataclasses import dataclass
from faker import Faker
from random import randint

@dataclass
class Approach:
    name: str

    @staticmethod
    def create_fake() -> 'Approach':
        faker = Faker()
        name = faker.sentence(randint(1, 3)).replace(".", "")
        return Approach(
            name=name
        )
