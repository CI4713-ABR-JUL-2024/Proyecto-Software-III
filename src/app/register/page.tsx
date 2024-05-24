import React from 'react'
import Button from '../components/Button'
import RegisterForm from '../components/RegisterForm'

type RegisterValues = {
  name: string;
  last_Name: string;
  telephone: string;
  email: string;
  ci: string;
  password: string;
  confirmPassword: string;
  role: string;
};


const Register = () => {

  return (
    <main>
      <RegisterForm />
    </main>
  );
}

export default Register