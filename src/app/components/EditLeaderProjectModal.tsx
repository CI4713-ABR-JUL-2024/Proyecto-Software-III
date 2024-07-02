'use client';
import AppRouter from 'next/dist/client/components/app-router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';

export default function EditLeaderProjectModal({
    isOpen, setIsOpen, projectId,  setRefreshList, approachList, organizationList}:
    { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, projectId: string | null, setRefreshList: React.Dispatch<React.SetStateAction<boolean>>,approachList:any, organizationList:any }) {
    const [projectTrimestre, setProjectTrimestre] = useState('');
    const [projectYear, setProjectYear] = useState('');
    const [projectOrg, setProjectOrg] = useState('');
    const [projectApproach, setProjectApproach] = useState('');
    const [projectArea, setProjectArea] = useState('');
    const [cookies] = useCookies(['access_token']);
    const [organization, setOrganization] = useState<any>(undefined);
    const [approach, setApproach] = useState<any>(undefined);
    
  
    // UseEffect para obtener los detalles del proyecto al abrir el modal

    async function onClick (e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();

        try {
            const editProject = {
              description: 'Falta descripcion',
              trimester: projectTrimestre,
              year: projectYear,
              organization_id: Number(organization),
              aproach_id: Number(approach),
              area: projectArea,
            }
            console.log(projectId)
            const response = await fetch(
                new URL(`api/project/${projectId}`, process.env.NEXT_PUBLIC_BASE_URL),
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies.access_token}`,
                    },
                    body: JSON.stringify(editProject),
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
                    <select
                        id='organization'
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="border invalid:text-gray-400  border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                        required
                    >
                        <option disabled className="text-gray-400" value="">Seleccione una organización</option>
                        {organizationList.map((item: any) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    <select
                        id='approach'
                        value={approach}
                        onChange={(e) => setApproach(e.target.value)}
                        className="border invalid:text-gray-400 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                        required
                    >
                      <option disabled className="text-gray-400" value="">Seleccione un abordaje</option>
                        {approachList.map((item: any) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
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