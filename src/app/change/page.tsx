import React from "react";
import Button from "../components/Button";
import ChangeForm from "../components/ChangeForm";

const changePassword = () => {
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
      <h1
        className="text-4xl font-bold text-gray-900 mx-auto"
        style={{ color: "#3A4FCC" }}
      >
        Cambio de contraseña
      </h1>
      </h1>
      <ChangeForm />
    </main>
  );
};

export default changePassword;
