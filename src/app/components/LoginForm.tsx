"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema, TLoginResponse } from "@/zodSchema/login";
import { useState } from "react";
import { useCookies } from "react-cookie";

type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState(""); // State variable for error message
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["access_token","id"]);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  async function redirect_token(data: TLoginResponse) {
    let today = new Date();
    let expires = new Date(today.setDate(today.getDate() + 3));

    console.log(data);
    setCookie("access_token", data.accessToken, { path: "/", expires });
    setCookie("id", data.id, { path: "/", expires });
    router.push("/profile");
  }

  async function onSubmit(data: FormData) {
    const r = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/auth", {
      method: "POST",
      body: JSON.stringify({ email: data.email, password: data.password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ocurrió un error en la autenticación");
        }
        return res.json();
      })
      .then((data) => {
        redirect_token(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("*Incorrect email address or password"); // Set the error message
      });
  }

  return (
    <div>
      <div>
        <div>
          <div>
            {/* Form Body */}
            <div className="flex flex-col justify-center h-[100vh]">
              <div className="flex justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mx-auto"
                style={{ color: "#3A4FCC" }}
                >
                  ¡Bienvenido!
                </h1>
              </div>
              <div className="flex justify-center">
                  <p className="text-black-600 mt-2">
                     Inicia sesión con tu cuenta
                  </p>
              </div>
              <form
                className="mt-6 grid gap-4  w-[40vw] mx-auto shadow-2xl p-12 rounded-2xl"
                action=""
                method="POST"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Email Input */}
                <div className="relative">
                  <input
                    {...register("email", { required: true })}
                    id="email"
                    name="email"
                    type="text"
                    className="peer h-10 rounded-md	w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none"
                    placeholder="john@doe.com"
                    autoComplete="off"
                  />
                  <label
                    htmlFor="email"
                    className="absolute -top-3.5 pl-3 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Email address
                  </label>
                </div>
                {errors?.email && (
                    <p className="text-red-600 text-sm">
                      {errors?.email?.message}
                    </p>
                  )}

                {/* Password Input */}
                <div className="relative mt-10">
                  <input
                    {...register("password", { required: true })}
                    id="password"
                    type="password"
                    name="password"
                    className="peer h-10 rounded-md	w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none"
                    placeholder="Password"
                    autoComplete="off"
                  />
                  <label
                    htmlFor="password"
                    className="absolute -top-3.5 pl-3 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Password
                  </label>
                </div>
                {errors?.password && (
                    <p className="text-red-600 text-sm">
                      {errors?.password?.message}
                    </p>
                  )}
                {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={false}
                  className="mt-10 block w-2/3 mx-auto cursor-pointer rounded bg-blue-500 px-4 py-2 text-center font-semibold text-white hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
                  style={{ backgroundColor: "#3A4FCC" }}
                >
                  {isSubmitting ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-6 h-6 mr-2 text-white animate-spin fill-rose-600 opacity-100"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* SVG for Spinner Animation */}
                      </svg>
                    </div>
                  ) : (
                    "Iniciar sesión"
                  )}
                </button>

                {/* Register Link */}
                <p className="text-center mt-4 text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <a
                    href="/register"
                    className="text-blue-500 hover:underline"
                    style={{ color: "#3A4FCC" }}
                  >
                    Regístrate
                  </a>
                </p>
                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
