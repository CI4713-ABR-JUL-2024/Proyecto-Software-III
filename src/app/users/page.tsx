'use client';
import { FaPen, FaTrash } from "react-icons/fa";
import Table from "../components/GenericTable";
import { IoSearchCircle } from "react-icons/io5";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import EditRoleModal from "../components/EditRoleModal";
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import DeleteUserModal from "../components/DeleteUserModal";


const roleMapping: { [key: string]: string } = {
    'admin': "Administrador",
    'general_management': 'Gerente General',
    'operations_management': 'Gerente de Operaciones',
    'account_submanagement': 'Subgerente de Cuentas',
    'account_analyst': 'Analista de Cuentas',
    'change_agents': 'Agente de Cambio',
    'project_leader': 'Líder de Proyecto',
    'agile_coach': 'Coach Ágil',
    'not_assigned': 'No asignado',
  };
  
  function getRoleName(roleKey: string) {
    return roleMapping[roleKey] || 'Rol no encontrado';
  };

export default function UsersTable() {
    const router = useRouter();
    const [searchVal, setSearchVal] = useState("");
    const [addUser, setAddUser] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [role, setRole] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [userPassword, setUserPassword] = useState('12345678'); // Default password for new users
    const [errorCreatingUser, setErrorCreatingUser] = useState(false);
    const [cookies, setCookie] = useCookies(['access_token'	]);
    const [userId, setUserId] = useState<string | null>(''); // Provide a default value of an empty string
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userList, setUserList] = useState<any>([]);
    const [userJson, setUserJson] = useState<any>();
    const [refreshList, setRefreshList] = useState<boolean>(false);

    const tableProp = {
        header : ["ID","Correo","Nombre","Apellido","Rol","Telefono"] , 
        info: userList,
        buttons:[FaPen,FaTrash],
        buttons_message: ["Edit", "Delete"]
    }

    const [userTable, setUserTable] = useState(tableProp);

    useEffect(() => {
        //console.log("TOKEN")
        //console.log(cookies.access_token);
        if (cookies.access_token != undefined) {
            fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user',{
                method: "GET" , 
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                },
            })
            .then(res => {

                return res.json();
            }).then(data => {
                //console.log("ESTA ES LA DATA ");
                //console.log(data);
                const list = listToArrayOfArrays(data);
                //console.log("LISTA AAA");
                //console.log(list);
                setUserJson(data);
                setUserList(list);
                setUserTable({ header: tableProp.header, info: list, buttons: tableProp.buttons, buttons_message: tableProp.buttons_message });
               
                //console.log("userList");
                //console.log(userList);
            }).catch(error => {
                console.error('error', error);
            });
        } else {
            console.error('No hay token de acceso');
            router.push('/');
        }
        setRefreshList(false);
    }, [refreshList]);

    // ejemplo de como se veria la info de la tabla
    function listToArrayOfArrays(list: any) : string[][] { 
        var array : string[][] = [];
        list.map((item: any) => {
            array.push([
                item.id.toString(),
                item.email.toString(),
                item.name.toString(),
                item.last_name.toString(),
                getRoleName(item.role_name),
                item.telephone.toString() 
            ]);
            
        });
        //console.log("arrayOf");
        //console.log(array);
        return array;
    }


    const handleClick = (e: any,id: any) => {
        //e number of button on list
        //id position of user in info list
        if (e === 0) {
            setUserId(id);
            setIsModalOpen(true);
            console.log("Se quiere editar el usuario", id);
        } 

        if (e === 1) {
            setUserId(id);
            setIsDeleteModalOpen(true);
            console.log("Se quiere eliminar el usuario", id);
        }

        //console.log(e);
        //rellenar con el manejo del click hecho dependiendo del boton y el usuario 
    };

    function handleSearchClick() {
        if (searchVal === "") {
            setUserTable(tableProp);
            return;
        }
        const filterBySearch = tableProp.info.filter((item: any) => {
            const lowercaseItem = item.map((str: any) => str.toLowerCase()); // Convert each string in the item array to lowercase
            if (lowercaseItem.some((str: any) => str.includes(searchVal.toLowerCase()))) {
                return item;
            }
            return null;
        });
        setUserTable({header: tableProp.header, info: filterBySearch, buttons: tableProp.buttons, buttons_message: tableProp.buttons_message});
    }


    async function createUser() {
        console.log("entro a crear usuario")
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                },
                body: JSON.stringify({
                    email: email,
                    name: name,
                    last_name: surname,
                    role_name: role,
                    telephone: telephone,
                    password: userPassword,
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error al crear usuario', error);
        }
    }   

return (
    <main className="flex">
        <Sidebar role="admin" />
        <div className="m-10 flex flex-col w-full">
            <div className="flex justify-between w-full p-4">
                <h3 className="text-2xl font-bold text-[#3A4FCC]">Perfiles de Usuarios</h3>
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
                    <button onClick={() => setAddUser(true)}
                        className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full">Crear Usuario</button>
                </div>
            </div>
            {addUser && <div className="flex p-5">

                <input 
                    id="email"
                    type="text"
                    value={email}
                    placeholder="Correo"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                    onChange={(e) => { setEmail(e.target.value) }}
                    required
                />
                <input 
                    id="name"
                    type="text"
                    value={name}
                    placeholder="Nombre"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5" 
                    onChange={(e) => { setName(e.target.value) }}
                    required
                />
                <input 
                    id="surname"
                    type="text"
                    value={surname}
                    placeholder="Apellido"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                    onChange={(e) => { setSurname(e.target.value) }}
                    required
                />
                <select
                    id = "role"
                    onChange={(e) => { setRole(e.target.value) }}
                    className="border invalid:text-gray-400  border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                    required
                    value={role}
                >
                    <option disabled className="text-gray-400" value="">Seleccione un rol</option>
                    <option value="general_management">Gerente General</option>
                    <option value="operations_management">Gerente de Operaciones</option>
                    <option value="account_submanagement">Sub-Gerente de Cuentas</option>
                    <option value="account_analyst">Analista de Cuentas</option>
                    <option value="change_agents">Agente de Cambio</option>
                    <option value="project_leader">Líder de Proyecto</option>
                    <option value="agile_coach">Coach Ágil</option>
                </select>

                <input 
                    id="telephone"
                    type="number"
                    value={telephone}
                    placeholder="Teléfono"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                    onChange={(e) => { setTelephone(e.target.value) }}
                    required
                />
                <button
                    type="submit"
                    className="bg-[#3A4FCC] text-white font-bold py-2 px-5 rounded-full"
                    onClick={() => {
                        if (!telephone || !role || !email || !name || !surname) {
                            console.error("Por favor completa todos los campos.");
                            setErrorCreatingUser(true);
                            return;
                        }
                        setAddUser(false);
                        console.log(email, name, surname, role, telephone);
                        if (errorCreatingUser) setErrorCreatingUser(false);
                        createUser();
                    }}
                >
                    Crear
                </button>
            </div>
            }
            {errorCreatingUser && <p className="text-red-500">Por favor completa todos los campos necesarios.</p>}
            <Table props={userTable} onClick={handleClick} />
        </div>
        <div>
            <EditRoleModal userId={userId} isOpen={isModalOpen} setIsOpen={setIsModalOpen} setRefreshList={setRefreshList}/>
            <DeleteUserModal userId={userId} isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} userList={userJson} setRefreshList={setRefreshList}/>
        </div>
    </main>
);
}

