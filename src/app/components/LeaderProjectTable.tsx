'use client'
import {useEffect, useState} from 'react';
import { FaPlus, FaPen, FaTrash } from "react-icons/fa";
import Table from '../components/Table';
import Sidebar from "../components/Sidebar";
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { IoSearchCircle } from 'react-icons/io5';
import ApproachModal from '../components/ApproachModal';
import { set } from 'zod';

export default function LeaderProjectTable(role: any) {
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

    const tableProps = {
        header: ['ID','Trimestre', 'Año', 'Organización', 'Abordaje', 'Área'],
        info: projectList,
        buttons: [FaPlus, FaPen, FaTrash],
        buttons_message: ['Generar diseño OKR', 'Editar Proyecto', 'Eliminar Proyecto'],
    };
    const [projectTable, setProjectTable] = useState(tableProps);

    //AGREGAR NUEVA LLAMADA AL ENDPOINT DE PROYECTOS
    useEffect(() => {
        getProjects();
        
    }, []);


    //Convertir la lista de proyectos en un array de arrays
    function listToArrayOfArrays(list: any) : string[][] { 
        var array : string[][] = [];
        list.map((item: any) => {
            array.push([
                item.id.toString(),
                item.trimester.toString(),
                item.year.toString(),
                item.organization.toString(),
                item.approach.toString(),
                item.area.toString()
            ]);
            
        });
        //console.log("arrayOf");
        //console.log(array);
        return array;
    } 
   
    const handleClick = (e: any, id: any) => {
        if (e === 0) {
            console.log('Generar diseño OKR');
        }
        
        if (e === 1) {
            console.log('Editar Proyecto');
        }

        if (e === 2) {
            console.log('Eliminar Proyecto');
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

    async function getProjects() { 
        console.log('Se obtuvieron los proyectos')
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/project', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                },
            });
            const data = await response.json();
            //console.log(data);
            const list = listToArrayOfArrays(data);
            setProjectList(list);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function createProject() {
        console.log('Crear Proyecto')
        try {
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1; // Normalizamos el valor del mes (0-11)
            const year = today.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            const start = new Date(formattedDate);
            const end = start.setFullYear(start.getFullYear() + 1);
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                },
                body: JSON.stringify({
                    trimester: trimester,
                    year: year,
                    start: start,
                    end: end,
                    organization_id: organization.id,
                    approach_id: approach.id,
                    area: area,

                }),
            });
            const data = await response.json();
            console.log(data);
            getApproachs();
            getOrganizationsData();
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
                        >Crear Projecto
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
            </div>
        </main>
    )
};