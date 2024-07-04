'use client'
import {use, useEffect, useState} from 'react';
import { FaPlus, FaPen, FaTrash } from "react-icons/fa";
import Table from '../components/Table';
import Sidebar from "../components/Sidebar";
import { useCookies } from 'react-cookie';
import { redirect, useRouter } from 'next/navigation';
import { IoSearchCircle } from 'react-icons/io5';
import ApproachModal from '../components/ApproachModal';
import EditLeaderProjectModal from './EditLeaderProjectModal';
import { set } from 'zod';
import DeleteLeaderProjectModal from './DeleteLeaderProjectModal';

export default function LeaderProjectTable(role: any) {
    const router = useRouter();
    const [projectList, setProjectList] = useState<any>([]);
    const [cookies, setCookie] = useCookies(['access_token']);
    const [searchVal, setSearchVal] = useState("");
    const [addProject, setAddProject] = useState(false);
    const [addApproach, setAddApproach] = useState(false);
    const [trimester, setTrimester] = useState('');
    const [year, setYear] = useState('');
    const [organization, setOrganization] = useState<any>(undefined);
    const [approach, setApproach] = useState<any>(undefined);
    const [area, setArea] = useState('');
    const [approachList, setApproachList] = useState<any>([]);
    const [organizationList, setOrganizationList] = useState<any>([]);
    const [errorCreatingProject, setErrorCreatingProject] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null); // Estado para almacenar el proyecto seleccionado para editar
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para abrir el modal de eliminación
    const [selectedProjectId, setSelectedProjectId] = useState(''); // Estado para almacenar el id del proyecto seleccionado para eliminar
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para abrir el modal de edición
    const [refreshList, setRefreshList] = useState(false); // Estado para refrescar la lista de proyectos
    

    const tableProps = {
        header: ['ID','Trimestre', 'Año', 'Organización', 'Abordaje', 'Área'],
        info: projectList,
        buttons: [FaPlus, FaPen, FaTrash],
        buttons_message: ['Generar diseño OKR', 'Editar Proyecto', 'Eliminar Proyecto'],
    };
    const [projectTable, setProjectTable] = useState(tableProps);

    //AGREGAR NUEVA LLAMADA AL ENDPOINT DE PROYECTOS
    useEffect(() => {
        if (cookies.access_token != undefined) { 
            fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/project', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                },
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
                const list = listToArrayOfArrays(data.projects);
                setProjectList(list);
                setProjectTable({header: tableProps.header, info: list, buttons: tableProps.buttons, buttons_message: tableProps.buttons_message});    
            }).catch(error => {
                console.error('Error:', error);
            });
        } else {
            console.log('No hay token de acceso');
        }

        getApproachs();
        getOrganizationsData();
    }, []);

    useEffect(() => {
        //si se hace regreshList, se vuelve a llamar a la lista de proyectos
        if (refreshList) {
            //Aqui se deberia llamar a la lista de proyectos
            setRefreshList(false);
        }
    }, [refreshList]);


    //Convertir la lista de proyectos en un array de arrays
    function listToArrayOfArrays(list: any) : string[][] { 
        var array : string[][] = [];
        list.map((item: any) => {
            array.push([
                item.id.toString(),
                item.trimester.toString(),
                item.year.toString(),
                item.organization_id,
                item.aproach_id,
                item.area || "Sin área",
            ]);
            
        });
        //console.log("arrayOf");
        //console.log(array);
        return array;
    } 
   
    const handleClick = (e: any, id: any) => {
        if (e === 0) {
            router.push('/projects/objectives/'+id.toString());
        }
        
        if (e === 1) {
            console.log('Editar Proyecto');
            const project = projectTable.info.find((project: any) => project[0] === id.toString());
            if (project) {
                setSelectedProject({
                    id: project[0],
                    trimester: project[1],
                    year: project[2],
                    organization: project[3],
                    approach: project[4],
                    area: project[5],
                });
                setIsEditModalOpen(true);
                setSelectedProjectId(id);
            }
        }

        if (e === 2) {
            console.log('Eliminar Proyecto');
            setSelectedProjectId(id); // Almacenar el id del proyecto seleccionado
            setIsDeleteModalOpen(true); // Abrir modal de eliminación
        }
    }

    function handleSearchClick() {
        if (searchVal === "") {
            setProjectTable(tableProps);
            return;
        }
        const filterBySearch = tableProps.info.filter((item: any) => {
            const lowercaseItem = item.map((str: any) => str.toLowerCase()); // Convert each string in the item array to lowercase
            if (lowercaseItem.some((str: any) => str.includes(searchVal.toLowerCase()))) {
                return item;
            }
            return null;
        });
        setProjectTable({header: tableProps.header, info: filterBySearch, buttons: tableProps.buttons, buttons_message: tableProps.buttons_message});
    }



    async function createProject() {
        console.log('Crear Proyecto');
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth(); // Normalizamos el valor del mes (0-11)
        const thisYear = today.getFullYear();
        const nextYear = thisYear + 1;
        const start = new Date(thisYear, month, day); // Restamos 1 al mes para que sea compatible con el rango 0-11
        const end = new Date(nextYear, month, day);
               

        console.log(start, end);

        try {
            const newProject = {
                description: 'Falta descripcion',
                trimester: trimester,
                year: year,
                start: start,
                end: end,
                organization_id: Number(organization),
                aproach_id: Number(approach),
                area: area,
            };
            console.log(newProject);
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                },
                body: JSON.stringify(newProject),
            });
            const data = await response.json();
            console.log(data);
            
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function getApproachs() {
        console.log('Se obtuvieron los abordajes')
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/approach', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            setApproachList(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    /*
    const findApproach = (id: any) => {
        console.log(id);
        const approach = approachList.find((item: any) => item.id === Number(id));
        console.log(approach);
        return approach.name.toString();
    }

    const findOrganization = (id: any) => {
        console.log(id);
        const organization = organizationList.find((item: any) => item.id === Number(id));
        console.log(organization);
        return organization.name.toString();
    }
    */
    async function getOrganizationsData()  {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/organization', {
                method: "GET" , 
                headers : {
                    'Authorization': `Bearer ${cookies.access_token}`,
                    "type" : "text",
                },
            });
            const data = await response.json();
            console.log(data);
            setOrganizationList(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <main className='flex'>
            <Sidebar role={role.toString()}/>
            <div className="m-10 flex flex-col w-full">
                <div className="flex justify-between w-full p-4">
                    <h3 className="text-2xl font-bold text-[#3A4FCC]">Proyectos OKRs</h3>
                    <div className="flex w-1/3"> 
                        <input
                            type="text"
                            placeholder="Buscar usuario"
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={e => setSearchVal(e.target.value)}
                        />
                        <button>
                            <IoSearchCircle className="text-[#3A4FCC] w-10 h-10" onClick={handleSearchClick} />
                        </button>
                        <button 
                            onClick={() => setAddProject(true)}
                            className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full"
                        >Crear Proyecto
                        </button>
                        <button
                            onClick={() => setAddApproach(true)}
                            className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full"
                        >
                            Modificar abordajes
                        </button>
                    </div>
                </div> 
                {addProject && <div className='flex p-5'>
                    <input
                        id='trimester'
                        type='text'
                        value={trimester}
                        placeholder='Trimestre'
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                        onChange={(e) => {setTrimester(e.target.value)}}
                        required
                    />
                    <input
                        id='year'
                        type='year'
                        value={year}
                        placeholder='Año'
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                        onChange={(e) => setYear(e.target.value)}
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
                        value={area}
                        placeholder='Área'
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                        onChange={(e) => setArea(e.target.value)}
                        required
                    />
                    <button
                        type='submit'
                        className="bg-[#3A4FCC] text-white font-bold py-2 px-5 rounded-full"
                        onClick={() => {
                            if (!trimester || !year || !organization || !approach || !area) {
                                console.error("Por favor completa todos los campos.");
                                setErrorCreatingProject(true);
                                return;
                            }
                            setAddProject(false);
                            console.log(trimester, year, organization, approach, area);
                            if (errorCreatingProject) {
                                setErrorCreatingProject(false)
                            }
                            createProject();
                        }}
                    >
                        Crear
                    </button>
                </div>}
                {errorCreatingProject && <p className="text-red-500">Por favor completa todos los campos.</p>}
                
                <ApproachModal isOpen={addApproach} setIsOpen={setAddApproach} />
                <Table props={projectTable} onClick={handleClick}/>   

                <EditLeaderProjectModal 
                    isOpen={isEditModalOpen} 
                    setIsOpen={setIsEditModalOpen} 

                    projectId={selectedProjectId} 
                    setRefreshList={setRefreshList}

                    approachList = {approachList}
                    organizationList = {organizationList}
                />

                <DeleteLeaderProjectModal
                    isOpen={isDeleteModalOpen}
                    setIsOpen={setIsDeleteModalOpen}
                    projectId={selectedProjectId}
                    projectList={projectList}
                    setRefreshList={setRefreshList}
                />
            </div>
        </main>
    )
};