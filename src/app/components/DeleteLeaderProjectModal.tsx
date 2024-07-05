'use client';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';

export default function DeleteLeaderProjectModal({
  isOpen,
  setIsOpen,
  projectId,
  projectList,
  setRefreshList,
}: {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  projectId: string | null,
  projectList: any,
  setRefreshList: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [projectTrimestre, setprojectTrimestre] = useState('');
  const [projectOrg, setProjectOrg] = useState('');
  const [projectDescription, setprojectDescription] = useState('');
  const [cookies] = useCookies(['access_token']);

  // Función para obtener los detalles del proyecto por su ID
  function getProjectDetailsById(id: string) {
    const project = projectList.find((project: any) => project.id === id);
    if (project) {
      setprojectTrimestre(project.trimester); // Suponiendo que cada proyecto tiene un campo `name`
      setProjectOrg(project.organization_id); // Suponiendo que cada proyecto tiene un campo `organization`
      setprojectDescription(project.description); // Suponiendo que cada proyecto tiene un campo `area`
    } else {
      console.error({ error: 'Error Function', message: 'No se encontró el proyecto en getProjectDetailsById' });
    }
  }

  // UseEffect para obtener los detalles del proyecto al abrir el modal
  useEffect(() => {
    if (isOpen && projectId) {
      getProjectDetailsById(projectId);
      console.log('Proyecto encontrado', projectTrimestre, projectOrg, projectDescription);
    }
  }, [isOpen, projectId]);

  // Función para manejar la eliminación del proyecto
  async function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const response = await fetch(
        new URL(`api/project/${projectId}`, process.env.NEXT_PUBLIC_BASE_URL),
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.access_token}`,
          },
        }
      );

      if (response.ok) {
        console.log('Proyecto eliminado correctamente');
        console.log('ProjectId', projectId);
        console.log('Token', cookies.access_token);
        console.log('Response', response);
        setIsOpen(false);
        setRefreshList(true); // Refrescar la lista de proyectos después de la eliminación
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
      style={{ content: { width: '55vw', height: '45vh', margin: 'auto' } }}
    >
      <div className="flex flex-col justify-center h-[40vh]">
        <h1
          className="text-4xl font-bold text-gray-900 mx-auto"
          style={{ color: "#3A4FCC" }}
        >
          Eliminar un proyecto
        </h1>
        <form className="mt-6 flex flex-col items-center justify-center w-[50vw] mx-auto shadow-2xl p-12 rounded-2xl">
          <p className="text-lg text-gray-900 mx-auto mb-8">
            ¿Estás seguro de querer eliminar el proyecto [ID: {projectId} - {projectDescription} de Organización{projectOrg} - {projectTrimestre}]?
          </p>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="block w-full cursor-pointer rounded bg-red-500 px-4 py-2 text-center font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
              onClick={(e) => onClick(e)}
            >
              Eliminar
            </button>
            <button
              type="button"
              className="block w-full cursor-pointer rounded bg-gray-500 px-4 py-2 text-center font-semibold text-white hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
