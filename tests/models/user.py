from dataclasses import dataclass
from faker import Faker
from random import randint


@dataclass
class User:
    first_name: str
    last_name: str
    email: str
    phone_number: str
    password: str


def create_fake_user() -> User:
    faker = Faker()
    name, last_name = faker.first_name(), faker.last_name()
    email = f"{name}_{last_name}@test.com"
    phone_number = f"0424{randint(1000000, 9999999)}"
    password = "12345678"
    return User(
        first_name=name,
        last_name=last_name,
        email=email,
        phone_number=phone_number,
        password=password,
    )
