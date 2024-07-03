from dataclasses import dataclass
from faker import Faker
from random import randint

@dataclass
class Organization:
    first_name: str
    last_name: str
    email: str
    phone_number: str
    password: str

    @staticmethod
    def create_fake() -> 'Organization':
        faker = Faker()
        name, last_name = faker.first_name(), faker.last_name()
        email = f"{name}_{last_name}_{randint(0, 9999999)}@test.com"
        phone_number = f"0424{randint(1000000, 9999999)}"
        password = "12345678"
        return Organization(
            first_name=name,
            last_name=last_name,
            email=email,
            phone_number=phone_number,
            password=password,
        )
