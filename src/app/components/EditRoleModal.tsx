'use client';
import {useState} from 'react';
import * as z from "zod";
import { roleSchema } from "@/zodSchema/role";
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';


type RoleData = z.infer<typeof roleSchema>;

export default function EditRoleModal({ isOpen, setIsOpen, userId }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, userId: string | null }) {
  const [role, setRole] = useState("");
  const [cookies, setCookie] = useCookies(['access_token'	]);

  console.log('entro por el user', userId);

  async function onClick(e: React.MouseEvent<HTMLButtonElement>, data: string) {
    e.preventDefault();
    console.log('entro por el click', data);
    try {
      const response = await fetch(
        new URL(`api/userRole/${userId}`, process.env.NEXT_PUBLIC_BASE_URL),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.access_token}`,
            'type': 'text'
          },
          body: JSON.stringify({ role: data }),
        }
      );
  
      if (response.ok) {
        console.log('Rol cambiado correctamente');
        //console.log('role nuevo', data);
        console.log('userId', userId);
        console.log('token', cookies.access_token);
        console.log('response', response);
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        console.error(errorData.error_message);
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={() => setIsOpen(false)} ariaHideApp={false}
      style={{content: {width: '55vw', height: '55vh', margin: 'auto'}}}
    >
      <div className="flex flex-col justify-center h-[40vh]">
        <h1
          className="text-4xl font-bold text-gray-900 mx-auto"
          style={{ color: "#3A4FCC" }}
        >
          Escoge el nuevo rol de usuario
        </h1>
        <form
          className="mt-6 flex flex-col items-center justify-center w-[50vw] mx-auto shadow-2xl p-12 rounded-2xl"
        >
          <select
            id = "role"
            onChange={(e) => { setRole(e.target.value)}}
            className="border invalid:text-black-400 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5 w-full text-xl"
            required
            value={role}
          >
            <option disabled className="text-gray-400" value="">Seleccione un rol</option>
            <option value="general_management">Gerente General</option>
            <option value="operations_management">Gerente de Operaciones</option>
            <option value="account_submanagement">Sub-Gerente de Cuentas</option>
            <option value="account_analyst">Analista de Cuentas</option>
          </select>
          <button
            type="submit"
            className="mt-10 block w-2/3 mx-auto cursor-pointer rounded bg-blue-500 px-4 py-2 text-center font-semibold text-white hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70col-span-2"
            style={{ backgroundColor: "#3A4FCC" }}
            onClick={(e) => onClick(e, role)}
          >
            Listo
          </button>
        </form>
      </div>
    </Modal>
  );
};
