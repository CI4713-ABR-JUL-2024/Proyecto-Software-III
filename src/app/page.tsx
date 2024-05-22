'use client'
import Button from "./components/Button";
import LoginForm from "./components/LoginForm";

export default function Home() {
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
      <LoginForm />
    </main>
  );
}
