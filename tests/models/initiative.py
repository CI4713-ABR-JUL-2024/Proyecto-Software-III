from dataclasses import dataclass
from faker import Faker
from random import randint, choice


@dataclass
class Initiative:
    name: str

    @staticmethod
    def create_fake() -> "Initiative":
        faker = Faker()
        name = faker.sentence(randint(1, 3)).replace(".", "")
     
        return Initiative(
            name=name
        )
