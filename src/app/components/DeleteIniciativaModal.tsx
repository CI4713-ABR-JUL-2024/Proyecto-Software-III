'use client'
import {useEffect, useState} from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';


export default function DeleteIniciativaModal({isOpen, setIsOpen, iniciativaId, iniciativaList}: {isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, iniciativaId: string | null, iniciativaList: any}) {
  const [name, setName] = useState('');
  const [cookies, setCookie] = useCookies(['access_token'	]);

  console.log('entro por el iniciativa', iniciativaId);

  async function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log('entro por el click', iniciativaId);
    try {

      const response = await fetch(
        new URL(`/api/initiativeType/${iniciativaId}`, process.env.NEXT_PUBLIC_BASE_URL),
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.access_token}`,
            'type': 'text'
          },
        }
      );
  
      if (response.ok) {
        console.log('Eliminado correctamente');
        console.log('iniciativaId', iniciativaId);
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
  
  function getIniciativaById(id: string) {
    const iniciativa = iniciativaList.find((iniciativa: any) => iniciativa.id === id);
    console.log('iniciativa', iniciativa);

    if (iniciativa) {
      setName(iniciativa.name);
    } else {
      console.error({error: 'Error Function', message: 'No se encontro iniciativa en getIniciativaById'})
    }
    return
  }

  useEffect(() => {
    if (isOpen && iniciativaId) {
        getIniciativaById(iniciativaId);    
    }
  }, [isOpen, iniciativaId]);

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={() => setIsOpen(false)} ariaHideApp={false}
      style={{content: {width: '55vw', height: '45vh', margin: 'auto'}}}
    >
      <div className="flex flex-col justify-center h-[40vh]">
        <h1
          className="text-4xl font-bold text-gray-900 mx-auto"
          style={{ color: "#3A4FCC" }}
        >
          Eliminar Tipo de Iniciativa
        </h1>
        <form
          className="mt-6 flex flex-col items-center justify-center w-[50vw] mx-auto shadow-2xl p-12 rounded-2xl"
        >
          <p className="text-lg text-gray-900 mx-auto mb-8">
            ¿Estás seguro de querer eliminar la iniciativa [ID: {iniciativaId} - {name}]?
          </p>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="block w-full cursor-pointer rounded bg-red-500 px-4 py-2 text-center font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70col-span-2"
              onClick={(e) => onClick(e)}
            >
              Eliminar
            </button>
            <button
              type="submit"
              className="block w-full cursor-pointer rounded bg-gray-500 px-4 py-2 text-center font-semibold text-white hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70col-span-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>    
  )


}