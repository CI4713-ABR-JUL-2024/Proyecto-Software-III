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
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "20vh",
        }}
      >
        PROYECTO SOFTWARE III
      </h1>
      <RegisterForm />
    </main>
  );
}

export default Register