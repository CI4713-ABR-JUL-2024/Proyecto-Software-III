'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { registerSchema } from "@/zodSchema/register";

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

  async function onSubmit(data: FormData) {
    console.log(isSubmitting);
    //console.log(data);
    const {name,email,password,role} = data;
    const user = {name,email,password,role};
    const ci = "1234567";
    //console.log(user);
    const response = await fetch(
        new URL('api/user', process.env.NEXT_PUBLIC_BASE_URL),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, ci, password, role}),
        },
      )
  
      if (response.ok) {
        console.log('Usuario creado correctamente')
        router.push('/')
      } else {
        const data = await response.json()
        console.error(data.error_message)
      }

    }

    // Replace this with a server action or fetch an API endpoint to authenticate
 //   await new Promise<void>((resolve) => {
    //  setTimeout(() => {
   //     resolve();
   //   }, 2000); // 2 seconds in milliseconds
   // });
   // router.push("");

  

  return (
    <div>
      <div>
        <div >
          <div >
            {/* Form Body */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Registrate aquí!
              </h1>
              <form
                className="mt-12"
                action=""
                method="POST"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Name Input */}
                <div className="relative">
                  <input
                    {...register("name", { required: true })}
                    id="name"
                    name="name"
                    type="text"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
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
                    className="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Nombre
                  </label>
                </div>

                {/* Last Name Input */}
                <div className="relative mt-10">
                  <input
                    {...register("lastName", { required: true })}
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
                    placeholder="Shek"
                    autoComplete="off"
                  />
                  {errors?.lastName && (
                    <p className="text-red-600 text-sm">
                      {errors?.lastName?.message}
                    </p>
                  )}
                  <label
                    htmlFor="lastName"
                    className="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Apellido
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative mt-10">
                  <input
                    {...register("email", { required: true })}
                    id="email"
                    type="email"
                    name="email"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
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
                    className="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Correo Electronico
                  </label>
                </div>

                {/* Password Input */}
                <div className="relative mt-10">
                  <input
                    {...register("password", { required: true })}
                    id="password"
                    type="password"
                    name="password"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
                    placeholder="Password"
                    autoComplete="off"
                  />
                  {errors?.password && (
                    <p className="text-red-600 text-sm">
                      {errors?.password?.message}
                    </p>
                  )}
                  <label
                    htmlFor="password"
                    className="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Contraseña
                  </label>
                </div>

                {/* Confirm Password Input */}
                <div className="relative mt-10">
                  <input
                    {...register("confirmPass", { required: true })}
                    id="confirmPass"
                    type="password"
                    name="confirmPass"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
                    placeholder="Confirm Password"
                    autoComplete="off"
                  />
                  {errors?.confirmPass && (
                    <p className="text-red-600 text-sm">
                      {errors?.confirmPass?.message}
                    </p>
                  )}
                  <label
                    htmlFor="confirmPass"
                    className="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Confirmar Contraseña
                  </label>
                </div>

                {/* Role Input */}
                <div className="relative mt-10">
                  <input
                    {...register("role", { required: true })}
                    id="role"
                    name="role"
                    type="text"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
                    placeholder="Admin"
                    autoComplete="off"
                  />
                  {errors?.role && (
                    <p className="text-red-600 text-sm">
                      {errors?.role?.message}
                    </p>
                  )}
                  <label
                    htmlFor="role"
                    className="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Rol
                  </label>
                </div>

                {/* Role Input */}
                <div className="relative mt-10">
                  <input
                    {...register("phone", { required: true })}
                    id="phone"
                    name="phone"
                    type="text"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
                    placeholder="1111111111"
                    autoComplete="off"
                  />
                  {errors?.phone && (
                    <p className="text-red-600 text-sm">
                      {errors?.phone?.message}
                    </p>
                  )}
                  <label
                    htmlFor="phone"
                    className="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Telefono
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isDirty || !isValid || isSubmitting}
                  className="mt-20 block w-full cursor-pointer rounded bg-rose-500 px-4 py-2 text-center font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring focus:ring-rose-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
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
                    "Crear cuenta"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}