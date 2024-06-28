'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import {useState} from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { changeSchema } from "@/zodSchema/changePassword";
import { getSession } from 'next-auth/react';
import { useCookies } from 'react-cookie';
import SuccessModal from "./SuccessModal";
import { RiContactsBookUploadFill } from "react-icons/ri";

// this is the type of the object that the form will return
type changeData = z.infer<typeof changeSchema>;




export default function ChangePassword() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<changeData>({
    resolver: zodResolver(changeSchema),
  });
  //const handleSubmit = useForm<typeofvalidator_user_update_password_body>()
  const [cookies, setCookie] = useCookies(['access_token'	]);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State variable for error message

// Asegúrate de que esta función se ejecute cuando se haga clic en el botón
async function onSubmit(data: changeData) {
  // Obtén el token de autenticación del localStorage
  /*
  console.log("cookies")
  console.log(cookies.access_token)
  */

    try {  
      const response = await fetch(
        new URL(`api/changePassword`, process.env.NEXT_PUBLIC_BASE_URL),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.access_token}`,
          },
          body: JSON.stringify({ oldPassword : data.oldPassword, newPassword : data.newPassword, compareNewPassword : data.compareNewPassword }),
        }
      );

      if (response.ok) {
        console.log('Clave cambiada correctamente');
        setPasswordChanged(true); 
      } else {
        const errorData = await response.json();
        console.error(errorData.error_message);
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      setErrorMessage("Error al cambiar la contraseña. Verifique que la contraseña actual sea correcta e intentélo de nuevo.");
    }

}



  return (
    <div className="flex items-center justify-center">
      <div className="w-auto h-auto shadow-lg p-8 shadow-slate-600 bg-[url(./images/background.jpg)] bg-cover bg-center bg-no-repeat">
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-8 grid grid-cols-2 gap-4" >
            <label className="font-bold text-xl text-center">
              Contraseña actual:
            </label>
            <input {...register("oldPassword")}
              type="password"
              name="oldPassword"
              className="h-8 border-solid border-2 rounded-md border-gray-400"
            />
            {errors?.oldPassword && (
              <p className="text-red-600 text-sm">
                Contraseña inválida. <br/> Verifique que la contraseña actual sea correcta.
              </p>
            )}
          </div>
          <div className="mb-8 grid grid-cols-2 gap-4">
            <label className="font-bold text-xl text-center">
              Nueva contraseña:
            </label>
            <input {...register("newPassword")}
              type="password"
              name="newPassword"
              className="h-8 border-solid border-2 rounded-md border-gray-400"
            />
            {errors?.newPassword && (
              <p className="text-red-600 text-sm">
                La nueva contraseña debe tener al menos 8 caracteres.
              </p>
            )}
          </div>
          <div className="mb-12 grid grid-cols-2 gap-4">
            <label className="font-bold text-xl text-center">
              Confirmar nueva contraseña:
            </label>
            <input {...register("compareNewPassword")}
              type="password"
              name="compareNewPassword"
              className="h-8 border-solid border-2 rounded-md border-gray-400"
            />
            {errors?.compareNewPassword && (
              <p className="text-red-600 text-sm">
                La nueva contraseña debe tener al menos 8 caracteres.
              </p>
            )}
          </div>
          <div className="flex items-center justify-center flex-col">
            {errorMessage && <p className="text-red-600 text-sm p-3">Verifique que las contraseñas sean válidas.</p>}
            <button type="submit" className=" bg-blue-500 text-white rounded-md p-2 shadow-md shadow-slate-700 hover:bg-blue-400 mb-4 text-lg font-bold w-[-webkit-fill-available]">
              Cambiar contraseña
              </button>
          </div>
          {passwordChanged && (
            <SuccessModal title = "Actualización exitosa" message="Contraseña cambiada correctamente" />
          )}
        </form>
      </div>
    </div>
  );
};


