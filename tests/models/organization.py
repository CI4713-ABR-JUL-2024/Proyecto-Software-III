from dataclasses import dataclass
from faker import Faker
from random import randint, choice


@dataclass
class Organization:
    name: str
    country: str
    state: str
    responsible: str
    phone_number: str
    email: str

    @staticmethod
    def create_fake() -> "Organization":
        faker = Faker()
        name = faker.company()
        country = faker.country()
        state = faker.city()
        resposible = faker.name()
        phone_number = f"{choice(['0424', '0414'])}{randint(1000000, 9999999)}"
        email = f"{resposible.replace(' ', '_')}_{randint(0, 9999999)}@gmail.com"        
        return Organization(
            name=name,
            country=country,
            state=state,
            responsible=resposible,
            phone_number=phone_number,
            email=email,
        )
