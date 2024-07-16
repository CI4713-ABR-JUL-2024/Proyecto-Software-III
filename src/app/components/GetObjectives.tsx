'use client';
import { FaPen, FaTrash, FaPrint, FaFilePdf,FaPlay, FaCross, FaPlus } from "react-icons/fa";
import Table from "../components/ObjectivesTable"
import { IoSearchCircle } from "react-icons/io5";
import { use, useState } from "react";
import Sidebar from "../components/Sidebar"
import { useRef,useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useCookies } from 'react-cookie';
import { useRouter } from "next/navigation";
import CreateObjective from "./CreateObjective";



type ObjectiveTableProps = {
    objectivesInfo: string[][];
    projectInfo: string;
    role: string;
    okrDesignId: number;
  };

export default function ObjectivesTable({ role, objectivesInfo, projectInfo, okrDesignId}: ObjectiveTableProps) {
  const [searchVal, setSearchVal] = useState("");
  const [addObjective, setAddObjective] = useState(false);
  const [name, setName] = useState('');
  const [errorCreatingObjective, setErrorCreatingObjective] = useState(false);
  const [editingObjective, setEditingObjective] = useState<string[] | null>(null);
  const [editName, setEditName] = useState('');
  const [cookies, setCookie] = useCookies(['access_token','id']);
  const componentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
    
  console.log(projectInfo);
  console.log(objectivesInfo);

  const tableProp = {
      header : ["ID","Objetivos"], 
      info: objectivesInfo,
      buttons:[FaPlus, FaPen,FaTrash], 
      buttons_message:["Agregar","Editar","Eliminar"]}
  const [objectivesTable, setObjectivesTable] = useState(tableProp);
  const handleClick = async (e: any,id: string[]) => {
    
      //e number of button on list
      //id position of user in info list
      //console.log(e);
      if(e == 0){
        router.push('/objective_details');
      }
      if(e == 2){        
        console.log("Eliminar");
        try {
            const objectiveId = id[0]; 
            const response = await fetch(`/api/objective/${objectiveId}`, { method: 'DELETE',

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
          } catch (error) {
            console.error('Error:', error);
          }
        
        
      }
        if(e == 1){
            console.log("Editar");
            setEditingObjective(id);
            setEditName(id[1]);
        }
  };

  function handleSearchClick() {
      if (searchVal === "") {
          setObjectivesTable(tableProp);
          return;
      }
      const filterBySearch = tableProp.info.filter((item) => {
          if (item.includes(searchVal)) {
              return item;
          }
      });
      setObjectivesTable({header: tableProp.header, info: filterBySearch, buttons: tableProp.buttons, buttons_message: tableProp.buttons_message});
  }return (
    <main className="flex">
        <Sidebar role="admin" />
        <div className="m-10 flex flex-col w-full">
            <div>
            <span className="text-2xl font-bold text-[#3A4FCC]">Proyecto:      </span>
                <span className="font-bold margin"> 
                {projectInfo}
                </span>
            </div>
            <div className="flex justify-between w-full p-4">
                <h3 className="text-2xl font-bold text-[#3A4FCC]"> Diseño de OKRs</h3>
                <div className="flex w-1/3"> 
                    <input
                        type="text"
                        placeholder="Buscar Objetivo"
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setSearchVal(e.target.value)}
                    />
                    <button>
                        <IoSearchCircle className="text-[#3A4FCC] w-10 h-10" onClick={handleSearchClick} />
                    </button>
                    <button onClick={() => setAddObjective(true)}
                        className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full">Crear Objetivo</button>
                </div>
            </div>
            {addObjective && <div className="flex p-5">
                <input 
                    id="nombre"
                    type="text"
                    value={name}
                    placeholder="Nombre del objetivo"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5" 
                    onChange={(e) => { setName(e.target.value) }}
                    required
                />
                <button
                    type="submit"
                    className="bg-[#3A4FCC] text-white font-bold py-2 px-5 rounded-full"
                    onClick={() => {
                        if (!name) {
                            console.error("Por favor completa todos los campos.");
                            setErrorCreatingObjective(true);
                            return;
                        }
                        setAddObjective(false);
                        console.log(name);
                        CreateObjective(name,okrDesignId,cookies);
                        if (errorCreatingObjective) setErrorCreatingObjective(false);
                    }}
                >
                    Crear
                </button>
            </div>
            }

            
        {editingObjective && <div className="flex p-5">
            <input 
                id="editNombre"
                type="text"
                value={editName}
                placeholder="Nombre del objetivo"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5" 
                onChange={(e) => { setEditName(e.target.value) }}
                required
            />  
            <button
                type="button"
                className="bg-[#3A4FCC] text-white font-bold py-2 px-5 rounded-full"
                onClick={
                async () =>  {
                if (!editName) {
                    console.error("Por favor completa todos los campos.");
                    setErrorCreatingObjective(true);
                    return;
                }
                console.log(editName);
                console.log(cookies.access_token);
                const objectiveId = editingObjective[0];
                const response = await fetch(`/api/objective/${objectiveId}`, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                    'type': 'text'
                    },
                    body: JSON.stringify({
                    name: editName,
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
                
                setEditingObjective([objectiveId,editName]);
                setEditingObjective(null);
                }} 
            > 
                Guardar
            </button>
            </div>}

            {errorCreatingObjective && <p className="text-red-500">Por favor completa todos los campos necesarios.</p>}
            <Table role ={role} props={objectivesTable} onClick={handleClick} />
        </div>
    </main>
);
}
