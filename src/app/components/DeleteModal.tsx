'use client';
import {useEffect, useState} from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';


interface ModalProps {
  isOpen : boolean,
  texti : string,
  fun : any,
  ID : any,
  title : string,
  text_success : string,
  text_failed : string,
  setModalOpen : any,
}

export default function DeleteModal({isOpen,texti,title,text_success,text_failed,fun,ID,setModalOpen} : ModalProps) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [text,setText] = useState(texti)

  async function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const a = await fun(ID);
    console.log(a)
    if (a == true){
      setText(text_success);
    }
    else{
      setText(text_failed);
    }
    console.log("CLICLING")
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={() => setModalOpen(false)} ariaHideApp={false}
      style={{content: {width: '55vw', height: '45vh', margin: 'auto'}}}
    >
      <div className="flex flex-col justify-center h-[40vh]">
        <h1
          className="text-4xl font-bold text-gray-900 mx-auto"
          style={{ color: "#3A4FCC" }}
        >
          {title}
        </h1>
        <form
          className="mt-6 flex flex-col items-center justify-center w-[50vw] mx-auto shadow-2xl p-12 rounded-2xl"
        >
          <p className="text-lg text-gray-900 mx-auto mb-8">
            {text}
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
              onClick={() => {setModalOpen(false)}}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
