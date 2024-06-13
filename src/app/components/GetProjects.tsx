'use client';
import { FaPen, FaTrash, FaPrint, FaFilePdf,FaPlay } from "react-icons/fa";
import Table from "../components/ProjectTable";
import { IoSearchCircle } from "react-icons/io5";
import { use, useState } from "react";
import Sidebar from "../components/Sidebar"
import CreateProject from "../components/CreateProject";
import { useRef,useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintProject } from "./PrintProject";
import { Content } from "next/font/google";
import { useCookies } from 'react-cookie';
import { useRouter } from "next/navigation";


type ProjectsTableProps = {
    projectInfo: string[][];
  };

export default function ProjectsTable({ projectInfo }: ProjectsTableProps) {
  const router = useRouter();
  const [cookies, setCookie,removeCookie] = useCookies(['access_token','id']);
  const [searchVal, setSearchVal] = useState("");
  const [addProject, setAddProject] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [inicio, setInicio] = useState('');
  const [cierre, setCierre] = useState('');
  const [errorCreatingProject, setErrorCreatingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<string[]>();
  const [role, setRole] = useState("");

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
    
  console.log(projectInfo);
  const p = [["1","Proyecto 1","2024-06-11T00:00:00.000Z","2024-06-11T00:00:00.000Z"],["2", "Proyecto 2","2024-06-11T00:00:00.000Z","2024-06-11T00:00:00.000Z"]]
  //console.log(p);
  useEffect(() => {
    if (cookies.access_token != undefined){
      fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user/'+cookies.id,{
      method: "GET" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"}})
      .then(res => {
        return res.json();
      })
      .then(data => {
        setRole(data.role_name)
      }).catch(error => {
        console.error('error', error);
      })
    }
    else{
      router.push("/");
    }
    
  }, []);

  const tableProp = {
      header : ["ID","Descripción","Inicio","Cierre"], 
      info: projectInfo,
      buttons:[FaPen,FaTrash,FaPrint,FaFilePdf,FaPlay], 
      buttons_message:["Editar","Eliminar","Imprimir","Generar","Deshabilitar"]}
  const [projectTable, setProjectTable] = useState(tableProp);

  const handleClick = (e: any,id: string[]) => {
      //e number of button on list
      //id position of user in info list
      //console.log(e);
      if(e == 0){
        console.log("Editar");
      }
      if(e == 1){
        console.log("Eliminar");
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
            {errorCreatingProject && <p className="text-red-500">Por favor completa todos los campos necesarios.</p>}
            <Table role={role} props={projectTable} onClick={handleClick} />
        </div>
    </main>
);
}
