from dataclasses import dataclass
from faker import Faker
from random import randint, choice


@dataclass
class Objective:
    name: str

    @staticmethod
    def create_fake() -> "Objective":
        faker = Faker()
        name = faker.sentence(randint(1, 3)).replace(".", "")
     
        return Objective(
            name=name
        )
