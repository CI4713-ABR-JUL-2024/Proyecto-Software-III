'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import {useState} from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { changeSchema } from "@/zodSchema/changePassword";
import { getSession } from 'next-auth/react';
import { useCookies } from 'react-cookie';
// this is the type of the object that the form will return
type changeData = z.infer<typeof changeSchema>;
/*type ChangePasswordValues ={
  oldPassword: string;
  newPassword: string;
  compareNewPassword: string;
}*/



export default function ChangePassword() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<changeData>({
    resolver: zodResolver(changeSchema),
  });
  //const handleSubmit = useForm<typeofvalidator_user_update_password_body>()
const [cookies, setCookie] = useCookies(['access_token']);

// Asegúrate de que esta función se ejecute cuando se haga clic en el botón
async function onSubmit(data: changeData) {
  try {
    
    const session = await getSession() as {user: {accessToken?: string}};

    console.log(data)
    console.log(cookies.access_token)
    
    const response = await fetch(
      new URL('api/changePassword', process.env.NEXT_PUBLIC_BASE_URL),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.access_token}`,
        },
        body: JSON.stringify({ oldPassword : data.oldPassword, newPassword : data.newPassword, compareNewPassword : data.compareNewPassword }
        ),
      }
    );

    if (response.ok) {
      console.log('Clave cambiada correctamente');
      // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito al usuario
    } else {
      const errorData = await response.json();
      console.error(errorData.error_message);
      // Aquí puedes manejar el caso de error, por ejemplo, mostrando un mensaje de error al usuario
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    // Maneja cualquier otro error que pueda ocurrir durante la solicitud
  }
}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '5px' }}>
          Contraseña actual
        </label>
        :
        <input {...register("oldPassword")} type="password" name="oldPassword" style={{ borderRadius: '5px', color: 'black' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '5px' }}>
          Nueva contraseña
        </label>
        :
        <input {...register("newPassword")} type="password" name="newPassword" style={{ borderRadius: '5px', color: 'black' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '5px' }}>
          Confirmar nueva contraseña
        </label>
        :
        <input {...register("compareNewPassword")} type="password" name="compareNewPassword" style={{ borderRadius: '5px', color: 'black' }} />
      </div>
      <div>

      <button type="submit" >
        Cambiar contraseña
      </button>
      </div>
    </form>
  );
};


