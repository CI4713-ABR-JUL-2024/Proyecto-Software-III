'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { registerSchema } from "@/zodSchema/register";
import { useState } from "react";
import RegisterSuccessModal from "./RegisterSuccessModal";
type FormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("");
  // constante para mostrar el modal de éxito
  const [showModal, setShowModal] = useState(false);

  async function onSubmit(data: FormData) {
    //console.log(data);
    const {name,email,password,role,telephone,last_Name} = data;
    const user = {name,email,password,role};

    const a = { name : name, last_name : last_Name, telephone: telephone, email : email, password : password, role : role};
    console.log('a')
    console.log(a)
    const r = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user',{
      method: "POST",body : JSON.stringify(a),
      })
      .then((res) => {
        if (res.status == 200){
          setShowModal(true);
        }
        return res.json();
      })
      .then((data) => {
        if (data!=undefined){
          setShowModal(true);
        }
        console.log(data);
      });

    }

return (
    <div>
      <div>
        <div>
          <div>
            {/* Form Body */}
            <div className="flex flex-col justify-center h-[100vh]">
              <h1
                className="text-4xl font-bold text-gray-900 mx-auto"
                style={{ color: "#3A4FCC" }}
              >
                ¡Registrate aquí!
              </h1>
              <p className="text-black-600 text-center mt-2">
                ¡Es fácil y rápido!
              </p>
              <form
                className="mt-6 grid grid-cols-2 gap-4  w-[50vw] mx-auto shadow-2xl p-12 rounded-2xl"
                action=""
                method="POST"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Name Input */}
                <div className="relative mt-5 ">
                  <input
                    {...register("name", { required: true })}
                    id="name"
                    name="name"
                    type="text"
                    className="peer h-10 w-full rounded-md border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none"
                    placeholder="Ana"
                    autoComplete="off"
                  />
                  {errors?.name && (
                    <p className="text-red-600 text-sm">
                      {errors?.name?.message}
                    </p>
                  )}
                  <label
                    htmlFor="name"
                    className="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all pl-3 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Nombre
                  </label>
                </div>

                {/* Last Name Input */}
                <div className="relative mt-5">
                  <input
                    {...register("last_Name", { required: true })}
                    id="last_Name"
                    name="last_Name"
                    type="text"
                    className="peer h-10 rounded-md w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none"
                    placeholder="Shek"
                    autoComplete="off"
                  />
                  {errors?.last_Name && (
                    <p className="text-red-600 text-sm">
                      {errors?.last_Name?.message}
                    </p>
                  )}
                  <label
                    htmlFor="lastName"
                    className="absolute -top-3.5 pl-3 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Apellido
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative mt-5 col-span-2">
                  <input
                    {...register("email", { required: true })}
                    id="email"
                    type="email"
                    name="email"
                    className="peer h-10 rounded-md	w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none"
                    placeholder="anashek@usb.com"
                    autoComplete="off"
                  />
                  {errors?.email && (
                    <p className="text-red-600 text-sm">
                      {errors?.email?.message}
                    </p>
                  )}
                  <label
                    htmlFor="email"
                    className="absolute -top-3.5 pl-3 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Correo Electronico
                  </label>
                </div>

                {/* Password Input */}
                <div className="relative mt-5">
                  <input
                    {...register("password", { required: true })}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="peer h-10 rounded-md	w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none"
                    placeholder="Password"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-0 end-0 p-3.5 rounded-e-md"
                  >
                    <svg
                      className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showPassword ? (
                        <>
                          <path
                            className="block"
                            d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                          ></path>
                          <circle
                            className="block"
                            cx="12"
                            cy="12"
                            r="3"
                          ></circle>
                        </>
                      ) : (
                        <>
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                          <line x1="2" x2="22" y1="2" y2="22"></line>
                        </>
                      )}
                    </svg>
                  </button>
                  {errors?.password && (
                    <p className="text-red-600 text-sm">
                      {errors?.password?.message}
                    </p>
                  )}
                  <label
                    htmlFor="password"
                    className="absolute -top-3.5 pl-3 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Contraseña
                  </label>
                </div>

                {/* Confirm Password Input */}
                <div className="relative mt-5">
                  <input
                    {...register("confirmPass", { required: true })}
                    id="confirmPass"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPass"
                    className="peer h-10 w-full rounded-md border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none"
                    placeholder="Confirm Password"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-0 end-0 p-3.5 rounded-e-md"
                  >
                    <svg
                      className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showPassword ? (
                        <>
                          <path
                            className="block"
                            d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                          ></path>
                          <circle
                            className="block"
                            cx="12"
                            cy="12"
                            r="3"
                          ></circle>
                        </>
                      ) : (
                        <>
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                          <line x1="2" x2="22" y1="2" y2="22"></line>
                        </>
                      )}
                    </svg>
                  </button>
                  {errors?.confirmPass && (
                    <p className="text-red-600 text-sm">
                      {errors?.confirmPass?.message}
                    </p>
                  )}
                  <label
                    htmlFor="confirmPass"
                    className="absolute -top-3.5 pl-3 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Confirmar Contraseña
                  </label>
                </div>

                {/* Role Input */}
                <div className="relative mt-5">
                  <select
                    {...register("role", { required: true })}
                    id="role"
                    name="role"
                    onChange={(e) => { setRole(e.target.value) }}
                    className="peer h-10 rounded-md	w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none"
                    value={role}
                  >
                    <option disabled className="text-gray-400" value="">Seleccione un rol</option>
                    <option value="Gerente General">Gerente General</option>
                    <option value="Gerente de Operaciones">Gerente de Operaciones</option>
                    <option value="Sub-Gerente de Cuentas">Sub-Gerente de Cuentas</option>
                    <option value="Analista de Cuentas">Analista de Cuentas</option>
                    <option value="Administrador de Sistemas">Administrador de Sistemas</option>
                  </select>
                  {errors?.role && (
                    <p className="text-red-600 text-sm">
                      {errors?.role?.message}
                    </p>
                  )}
                  <label
                    htmlFor="role"
                    className="absolute -top-3.5 pl-3 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Rol
                  </label>
                
                </div>

                {/* Phone Input */}
                <div className="relative mt-5">
                  <input
                    {...register("telephone", { required: true })}
                    id="telephone"
                    name="telephone"
                    type="text"
                    className="peer h-10 w-full rounded-md	border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none"
                    placeholder="1111111111"
                    autoComplete="off"
                  />
                  {errors?.telephone && (
                    <p className="text-red-600 text-sm">
                      {errors?.telephone?.message}
                    </p>
                  )}
                  <label
                    htmlFor="phone"
                    className="absolute -top-3.5 pl-3 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Telefono
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={false}
                  className="mt-10 block w-2/3 mx-auto cursor-pointer rounded bg-blue-500 px-4 py-2 text-center font-semibold text-white hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70
                  col-span-2"
                  style={{ backgroundColor: "#3A4FCC" }}
                >
                  {isSubmitting ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-6 h-6 mr-2 text-white animate-spin fill-blue-600 opacity-100"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* SVG for Spinner Animation */}
                      </svg>
                    </div>
                  ) : (
                    "Crear cuenta"
                  )}
                </button>
                {/* Login Link */}
                <p className="text-center mt-4 text-gray-600 col-span-2">
                  ¿Ya tienes una cuenta?{" "}
                  <a
                    href="/"
                    className="text-blue-500 hover:underline"
                    style={{ color: "#3A4FCC" }}
                  >
                    Inicia sesión
                  </a>
                </p>
                {showModal && (
                <RegisterSuccessModal title = "¡Registro exitoso!" message="Usuario creado correctamente" />
              )}
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}