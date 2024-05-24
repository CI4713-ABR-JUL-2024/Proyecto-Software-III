'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import {useState} from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { changeSchema } from "@/zodSchema/changePassword";
import { getSession } from 'next-auth/react';

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
const [oldPassword, setOldPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [compareNewPassword, setConfirmPassword] = useState('');
const [token, setToken] = useState('')
// Asegúrate de que esta función se ejecute cuando se haga clic en el botón
async function onSubmit(data: changeData) {
  try {
    
    const session = await getSession() as {user: {accessToken?: string}};

    console.log(data)
    const response = await fetch(
      new URL('api/changePassword', process.env.NEXT_PUBLIC_BASE_URL),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization-token': `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({ oldPassword, newPassword, compareNewPassword }
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
    <form>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '5px' }}>
          Contraseña actual
        </label>
        :
        <input type="password" name="oldPassword" style={{ borderRadius: '5px', color: 'black' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '5px' }}>
          Nueva contraseña
        </label>
        :
        <input type="password" name="newPassword" style={{ borderRadius: '5px', color: 'black' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '5px' }}>
          Confirmar nueva contraseña
        </label>
        :
        <input type="password" name="compareNewPassword" style={{ borderRadius: '5px', color: 'black' }} />
      </div>
      <div>

      <button type="button" onClick={() => onSubmit({ oldPassword, newPassword, compareNewPassword })}>
        Cambiar contraseña
      </button>
      </div>
    </form>
  );
};


