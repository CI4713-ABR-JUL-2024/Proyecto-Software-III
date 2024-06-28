'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';
import Table from '../components/Table';
import { FaCheck, FaPen, FaTrash } from "react-icons/fa";
import DeleteApproachModal from '../components/DeleteApproachModal';


export default function ApproachModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
	const [approach, setApproach] = useState("");
    const [cookies, setCookie] = useCookies(['access_token']);
    const [approachList, setApproachList] = useState<any>([]);
    const [approachJson, setApproachJson] = useState<any>();
    const [newApproach, setNewApproach] = useState(false);
    const [error, setError] = useState(false);
    const [refreshList, setRefreshList] = useState(false);
    const [deleteApproach, setDeleteApproach] = useState(false);
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState('');
    const [approachId, setApproachId] = useState<string | null>('');
    const tableProp = {
        header: ['ID', 'Tipo'],
        info: approachList,
        buttons: [FaPen, FaTrash],
        buttons_message: ['Editar', 'Eliminar'],
    }

    const [approachTable, setApproachTable] = useState(tableProp);

    useEffect(() => {
        console.log('Se montó el componente ApproachModal');
        if (cookies.access_token != undefined) {
            fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/approach', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                },
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
                const list = listToArrayOfArrays(data);
                setApproachJson(data);
                setApproachList(data);
                setApproachTable({header: tableProp.header, info: list, buttons: tableProp.buttons, buttons_message: tableProp.buttons_message});
            }).catch((error) => {
                console.error('Error:', error);
            });
        } else {
            console.error('No hay token de acceso');
        }
    }, [refreshList]);

    function listToArrayOfArrays(list: any): string[][] {
        var array: string[][] = [];
        list.map((item: any) => {
            array.push([
                item.id.toString(),
                item.name.toString(),
            ]);
        });
        return array;
    }

    const handleClick = (e: any, id: any) => {
        if (e === 0) {
            console.log('Editar');
            setEdit(true);
            setApproachId(id);
        }
        if (e === 1) {
            console.log('Eliminar', id);
            setApproachId(id);
            setDeleteApproach(true);
        }
    }

    async function createApproach() {
        console.log('Se quiere agregar un tipo de abordaje');
        try {
            const respose = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/approach', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                },
                body: JSON.stringify({ name: approach }),
            });
            const data = await respose.json();
            setRefreshList(true);
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function editApproach(e: React.MouseEvent<HTMLButtonElement>, data:string) {
        e.preventDefault();
        console.log('Se quiere editar un tipo de abordaje');
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/approach/'+approachId, 
                {   
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies.access_token}`,
                    },
                    body: JSON.stringify({ name: data }),
                });
            if (response.ok) {
                console.log('Tipo de abordaje editado correctamente');
                setRefreshList(true);
                setEdit(false);
            } else {
                const errorData = await response.json();
                console.error(errorData.error_message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
    }


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            ariaHideApp={false}
            style={{ content: { width: '70vw', height: '70vh', margin: 'auto' } }}
        >
            <div className="flex flex-col justify-center h-[10vh]">
                <div className="flex items-center">
                    <h1
                        className="text-4xl font-bold text-gray-900 mx-auto"
                        style={{ color: "#3A4FCC", marginTop: "0.5rem", marginBottom: "0.5rem"  }}
                    >
                        Tipos de Abordaje
                    </h1>
                    <button 
                        onClick={() => setNewApproach(true)}
                        className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full"
                    >Agregar
                    </button>
                </div>  
                {newApproach && 
                    <div className='flex p-5'>
                        <input
                            type="text"
                            placeholder='Nuevo tipo de abordaje'
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={e => setApproach(e.target.value)}
                        />
                        <button 
                            type='submit'
                            className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full"
                            onClick = {() => {
                                if (!newApproach) {
                                    console.error('Por favor, ingrese un tipo de abordaje');
                                    setError(true);
                                    return;
                                }
                                setNewApproach(false);
                                console.log(newApproach);
                                if (error) {
                                    setError(false);
                                }
                                createApproach();
                            }}
                        >
                            Guardar
                        </button>
                    </div>
                }
                {edit &&
                    <div className='flex p-5'>
                        <input
                            type="text"
                            placeholder="Editar tipo de abordaje"
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {setName(e.target.value)}}
                        />
                        <button 
                            type='submit'
                            className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full"
                            onClick = {(e) => editApproach(e, name)}
                        >
                            Listo
                        </button>
                    </div>

                }
                {deleteApproach &&
                    <DeleteApproachModal isOpen={deleteApproach} setIsOpen={setDeleteApproach} approachId={approachId} approachList={approachJson}  /> 
                }
            </div>
            
            <Table props={approachTable} onClick={handleClick} />
        </Modal>
    );
}