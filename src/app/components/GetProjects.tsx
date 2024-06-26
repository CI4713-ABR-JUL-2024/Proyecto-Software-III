'use client';
import { FaPen, FaTrash, FaPrint, FaFilePdf,FaPlay } from "react-icons/fa";
import Table from "../components/ProjectTable";
import { IoSearchCircle } from "react-icons/io5";
import { use, useState } from "react";
import Sidebar from "../components/Sidebar"
import CreateProject from "../components/CreateProject";
import { useRef,useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useCookies } from 'react-cookie';
import { PrintProject } from "./PrintProject";
import { Content } from "next/font/google";
import { useRouter } from "next/navigation";



type ProjectsTableProps = {
    projectInfo: string[][];
    role: string;
  };

export default function ProjectsTable({ projectInfo, role }: ProjectsTableProps) {
  const [searchVal, setSearchVal] = useState("");
  const [addProject, setAddProject] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [inicio, setInicio] = useState('');
  const [cierre, setCierre] = useState('');
  const [errorCreatingProject, setErrorCreatingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<string[]>();
  const [editingProject, setEditingProject] = useState<string[] | null>(null);
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editInicio, setEditInicio] = useState('');
  const [editCierre, setEditCierre] = useState('');
  const [cookies, setCookie] = useCookies(['access_token','id']);
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
    
  console.log(projectInfo);
  if (projectInfo === undefined) {
    projectInfo = [["1","Proyecto 1","2024-06-11T00:00:00.000Z","2024-06-11T00:00:00.000Z","ACTIVE"],["2", "Proyecto 2","2024-06-11T00:00:00.000Z","2024-06-11T00:00:00.000Z","ACTIVE"]]
  }
    console.log(projectInfo);

  const tableProp = {
      header : ["ID","Descripción","Inicio","Cierre"], 
      info: projectInfo,
      buttons:[FaPen,FaTrash,FaPrint,FaFilePdf,FaPlay], 
      buttons_message:["Editar","Eliminar","Imprimir","Generar","Deshabilitar"]}
  const [projectTable, setProjectTable] = useState(tableProp);
  const handleClick = async (e: any,id: string[]) => {
    
      //e number of button on list
      //id position of user in info list
      //console.log(e);
      if(e == 0){
        //Editar proyecto
        console.log("Editar");
        setEditingProject(id);
        setEditDescripcion(id[1]);
        setEditInicio(id[2]);
        setEditCierre(id[3]);

      }
      if(e == 1){
        //Eliminar proyecto
        console.log("Eliminar");
        try {
            const projectId = id[0]; 
            const response = await fetch(`/api/project/${projectId}`, { method: 'DELETE',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                    'type': 'text'
                  }
             });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data); 
            //Actualizar pagina luego de eliminar proyecto
            const updatedProjectInfo = projectInfo.filter(project => project[0] !== projectId);
            setProjectTable(prevState => ({ ...prevState, info: updatedProjectInfo }));
          } catch (error) {
            console.error('Error:', error);
          }
        
      }
        if(e == 2){
            //setCurrentProject(id);
            //handlePrint();
            window.print();
        }
        if(e == 3){
            console.log("Generar");
        }
        if(e == 4){
            console.log("Deshabilitar");
        }

      //rellenar con el manejo del click hecho dependiendo del boton y el usuario 
  };

  function handleSearchClick() {
      if (searchVal === "") {
          setProjectTable(tableProp);
          return;
      }
      const filterBySearch = tableProp.info.filter((item) => {
          if (item.includes(searchVal)) {
              return item;
          }
      });
      setProjectTable({header: tableProp.header, info: filterBySearch, buttons: tableProp.buttons, buttons_message: tableProp.buttons_message});
  }return (
    <main className="flex">
        <Sidebar role="admin" />
        <div className="m-10 flex flex-col w-full">
            <div className="flex justify-between w-full p-4">
                <h3 className="text-2xl font-bold text-[#3A4FCC]">Portafolio de Proyetos de OKRs</h3>
                <div className="flex w-1/3"> 
                    <input
                        type="text"
                        placeholder="Buscar proyecto"
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setSearchVal(e.target.value)}
                    />
                    <button>
                        <IoSearchCircle className="text-[#3A4FCC] w-10 h-10" onClick={handleSearchClick} />
                    </button>
                    <button onClick={() => setAddProject(true)}
                        className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full">Crear Proyecto</button>
                </div>
            </div>
            {addProject && <div className="flex p-5">
                <input 
                    id="descripcion"
                    type="text"
                    value={descripcion}
                    placeholder="Descripción del proyecto"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5" 
                    onChange={(e) => { setDescripcion(e.target.value) }}
                    required
                />
                <input 
                    id="inicio"
                    type="date"
                    value={inicio}
                    placeholder="Fecha de inicio"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                    onChange={(e) => { setInicio(e.target.value) }}
                    required
                />
                <input 
                    id="cierre"
                    type="date"
                    value={cierre}
                    placeholder="Fecha de cierre"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                    onChange={(e) => { setCierre(e.target.value) }}
                    required
                />
               
                <button
                    type="submit"
                    className="bg-[#3A4FCC] text-white font-bold py-2 px-5 rounded-full"
                    onClick={() => {
                        if (!descripcion || !inicio || !cierre) {
                            console.error("Por favor completa todos los campos.");
                            setErrorCreatingProject(true);
                            return;
                        }
                        setAddProject(false);
                        console.log(descripcion, inicio, cierre);
                        CreateProject(descripcion,inicio,cierre);
                        if (errorCreatingProject) setErrorCreatingProject(false);
                    }}
                >
                    Crear
                </button>
            </div>
            }

            
        {editingProject && <div className="flex p-5">
            <input 
                id="editDescripcion"
                type="text"
                value={editDescripcion}
                placeholder="Descripción del proyecto"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5" 
                onChange={(e) => { setEditDescripcion(e.target.value) }}
                required
            />
            <input 
                id="editInicio"
                type="date"
                value={editInicio}
                placeholder="Fecha de inicio"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                onChange={(e) => { setEditInicio(e.target.value) }}
                required
            />
            <input 
                id="editCierre"
                type="date"
                value={editCierre}
                placeholder="Fecha de cierre"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                onChange={(e) => { setEditCierre(e.target.value) }}
                required
            />
            
            <button
                type="button"
                className="bg-[#3A4FCC] text-white font-bold py-2 px-5 rounded-full"
                onClick={async () => {
                if (!editDescripcion || !editInicio || !editCierre) {
                    console.error("Por favor completa todos los campos.");
                    setErrorCreatingProject(true);
                    return;
                }
                console.log(editDescripcion, editInicio, editCierre);
                console.log(cookies.access_token);
                const projectId = editingProject[0];
                const response = await fetch(`/api/project/${projectId}`, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                    'type': 'text'
                    },
                    body: JSON.stringify({
                    description: editDescripcion,
                    start: editInicio,
                    end: editCierre
                    })
                });

                if (!response.ok) {
                  console.error(`HTTP error! status: ${response.status}`);
                  const errorText = await response.text();
                  console.error('Error body:', errorText);
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data); 
                
                setEditingProject([projectId, editDescripcion, editInicio, editCierre, 'ACTIVE']);
                setEditingProject(null);
                
                }}
            >
                Guardar
            </button>
            </div>}




            {errorCreatingProject && <p className="text-red-500">Por favor completa todos los campos necesarios.</p>}
            <Table role={role} props={projectTable} onClick={handleClick} />
        </div>
    </main>
);
}
