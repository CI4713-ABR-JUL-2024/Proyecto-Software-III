'use client';
import {useState} from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';


export default function EditInitiativeModal({ isOpen, setIsOpen, colId, setRefreshList }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, colId: string | null, setRefreshList: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [initiative, setInitiative] = useState("");
  const [cookies, setCookie] = useCookies(['access_token'	]);

  console.log('entro por el user', colId);

  async function onClick(e: React.MouseEvent<HTMLButtonElement>, data: string) {
    e.preventDefault();
    console.log('entro por el click', data);
    try {
      const response = await fetch(
        new URL(`api/api/initiativeType/${colId}`, process.env.NEXT_PUBLIC_BASE_URL),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.access_token}`,
            'type': 'text'
          },
          body: JSON.stringify({ initiative: data }),
        }
      );
  
      if (response.ok) {
        console.log('Iniciativa cambiada correctamente');
        //console.log('initiative nuevo', data);
        console.log('colId', colId);
        console.log('token', cookies.access_token);
        console.log('response', response);
        setIsOpen(false);
        setRefreshList(true);
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
      onRequestClose={() => setIsOpen(false)} 
      ariaHideApp={false}
      style={{content: {width: '55vw', height: '55vh', margin: 'auto'}}}
    >
      <div className="flex flex-col justify-center h-[40vh]">
        <h1
          className="text-4xl font-bold text-gray-900 mx-auto"
          style={{ color: "#3A4FCC" }}
        >
          Escoge un tipo de iniciativa
        </h1>
        <form
          className="mt-6 flex flex-col items-center justify-center w-[50vw] mx-auto shadow-2xl p-12 rounded-2xl"
        >
          <select
            id = "initiative"
            onChange={(e) => { setInitiative(e.target.value)}}
            className="border invalid:text-black-400 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5 w-full text-xl"
            required
            value={initiative}
          >
            <option disabled className="text-gray-400" value="">Seleccione un tipo de iniciativa</option>
            <option value="no_one">Ninguno</option>
            <option value="homework">Tarea</option>
            <option value="project">Proyecto</option>
          </select>
          <button
            type="submit"
            className="mt-10 block w-2/3 mx-auto cursor-pointer rounded bg-blue-500 px-4 py-2 text-center font-semibold text-white hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70col-span-2"
            style={{ backgroundColor: "#3A4FCC" }}
            onClick={(e) => onClick(e, initiative)}
          >
            Listo
          </button>
        </form>
      </div>
    </Modal>
  );
};
