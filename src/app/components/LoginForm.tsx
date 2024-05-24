'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema, TLoginResponse } from "@/zodSchema/login";

import { useCookies } from 'react-cookie';

type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['access_token']);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  async function redirect_token(data : TLoginResponse){
    let expires = new Date()
    console.log(data);
    expires.setTime(expires.getTime() + (500000))
    setCookie('access_token', data.accessToken, { path: '/',  expires})
    router.push("/profile");
  }

  async function onSubmit(data: FormData) {
    console.log(isSubmitting);
    // Replace this with a server action or fetch an API endpoint to authenticate

    const r = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/auth',{
      method: "POST" ,
      body : JSON.stringify({email : data.email, password : data.password}) })
        // if res.status is not 200  throw an error before res.json()
      .then((res) => res.json())
      .then((data) => {
        if (data != undefined){
          console.log(data);
          redirect_token(data);
        }
        
      });

    //const cookies = new Cookies();
    //cookies.set('myCat', 'Pacman', { path: '/' });
    //console.log(cookies.get('myCat')); // Pacman


    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000); // 2 seconds in milliseconds
    });
  }

  return (
    <div>
      <div>
        <div >
          <div >
            {/* Form Body */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back!
              </h1>
              <form
                className="mt-12"
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
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
                    placeholder="john@doe.com"
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
                    Email address
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
                    Password
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
                    "Sign In"
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