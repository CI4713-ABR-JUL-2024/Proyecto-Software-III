'use client';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';

export default function EditLeaderProjectModal({
    isOpen, setIsOpen, projectId,  setRefreshList }:
    { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, projectId: string | null, setRefreshList: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [projectTrimestre, setProjectTrimestre] = useState('');
    const [projectYear, setProjectYear] = useState('');
    const [projectOrg, setProjectOrg] = useState('');
    const [projectApproach, setProjectApproach] = useState('');
    const [projectArea, setProjectArea] = useState('');
    const [cookies] = useCookies(['access_token']);

    async function onClick (e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();

        try {
            const response = await fetch(
                new URL(`api/project/${projectId}`, process.env.NEXT_PUBLIC_BASE_URL),
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies.access_token}`,
                    },
                    body: JSON.stringify({ 
                        trimester: projectTrimestre,
                        year: projectYear,
                        organization: projectOrg,
                        approach: projectApproach,
                        area: projectArea 
                    }),
                }
            );

            if (response.ok) {
                console.log('Proyecto actualizado correctamente');
                console.log('projectId', projectId);
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
            style={{ content: { width: '55vw', height: '55vh', margin: 'auto' } }}
        >
            <div className="flex flex-col justify-center h-[40vh]">
                <h1 className="text-4xl font-bold text-gray-900 mx-auto" style={{ color: "#3A4FCC" }}>
                    Editar Proyecto
                </h1>
                <form className="mt-6 flex flex-col items-center justify-center w-[50vw] mx-auto shadow-2xl p-12 rounded-2xl">
                    <input
                        id='trimester'
                        type='text'
                        value={projectTrimestre}
                        placeholder='Trimestre'
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                        onChange={(e) => setProjectTrimestre(e.target.value)}
                        required
                    />
                    <input
                        id='year'
                        type='number'
                        value={projectYear}
                        placeholder='Año'
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                        onChange={(e) => setProjectYear(e.target.value)}
                    />
                    <input
                        id='organization'
                        type='text'
                        value={projectOrg}
                        placeholder='Organización'
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                        onChange={(e) => setProjectOrg(e.target.value)}
                    />
                    <input
                        id='approach'
                        type='text'
                        value={projectApproach}
                        placeholder='Abordaje'
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                        onChange={(e) => setProjectApproach(e.target.value)}
                    />
                    <input
                        id='area'
                        type='text'
                        value={projectArea}
                        placeholder='Área'
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                        onChange={(e) => setProjectArea(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="mt-10 block w-2/3 mx-auto cursor-pointer rounded bg-blue-500 px-4 py-2 text-center font-semibold text-white hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70col-span-2"
                        style={{ backgroundColor: "#3A4FCC" }}
                        onClick={onClick}
                    >
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </Modal>
    );
}