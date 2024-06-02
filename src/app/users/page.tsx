'use client';
import { FaPen, FaTrash } from "react-icons/fa";
import Table from "../components/Table";
import { useRouter } from "next/navigation";
import { useCookies } from 'react-cookie';
import { IoSearchCircle } from "react-icons/io5";
import { useState } from "react";
import Sidebar from "../components/Sidebar"

export default function UsersTable() {
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'id']);
    const [searchVal, setSearchVal] = useState("");
    const [addUser, setAddUser] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [role, setRole] = useState('');
    const [userType, setUserType] = useState('');
    const [email, setEmail] = useState('');
    const [errorCreatingUser, setErrorCreatingUser] = useState(false);
    // const [userList, setUserList] = useState([]);

    // ejemplo de como se veria la info de la tabla
    const tableProp = {
        header : ["Correo","Nombre","Apellido","Rol","Tipo de Usuario"] , 
        info: [["adelina@mail.co", "Adelina", "Figueira", "Admin", "User"],
            ["adelina@mail.co", "Rosario", "Figueira", "Admin", "User"]],
        buttons:[FaPen,FaTrash], 
        buttons_message:["Edit","Delete"]}
    const [userTable, setUserTable] = useState(tableProp);


    const handleClick = (e,id) => {
        //e number of button on list
        //id position of user in info list
        console.log(e);
        //rellenar con el manejo del click hecho dependiendo del boton y el usuario 
    };

    function handleSearchClick() {
        if (searchVal === "") {
            setUserTable(tableProp);
            return;
        }
        const filterBySearch = tableProp.info.filter((item) => {
            const lowercaseItem = item.map((str) => str.toLowerCase()); // Convert each string in the item array to lowercase
            if (lowercaseItem.includes(searchVal.toLowerCase())) {
                return item;
            }
        });
        setUserTable({header: tableProp.header, info: filterBySearch, buttons: tableProp.buttons, buttons_message: tableProp.buttons_message});
    }

return (
    <main className="flex">
        <Sidebar role="Admin" />
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
                    <option value="gerenteGeneral">Gerente General</option>
                    <option value="gerenteOp">Gerente de Operaciones</option>
                    <option value="gerenteCuentas">Sub-Gerente de Cuentas</option>
                    <option value="analistaCuentas">Analista de Cuentas</option>
                    <option value="admin">Administrador de Sistemas</option>
                </select>
                <select
                    id = "userType"
                    onChange={(e) => { setUserType(e.target.value) }}
                    className=" invalid:text-gray-400  border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
                    required
                    value = {role}
                >
                    <option disabled className="text-gray-400" value="">Seleccione el tipo de usuario</option>
                    <option value="interno">Interno</option>
                    <option value="externo">Externo</option>
                </select>
                <button
                    type="submit"
                    className="bg-[#3A4FCC] text-white font-bold py-2 px-5 rounded-full"
                    onClick={() => {
                        if (!userType || !role || !email || !name || !surname) {
                            console.error("Por favor completa todos los campos.");
                            setErrorCreatingUser(true);
                            return;
                        }
                        setAddUser(false);
                        console.log(email, name, surname, role, userType);
                        if (errorCreatingUser) setErrorCreatingUser(false);
                    }}
                >
                    Crear
                </button>
            </div>
            }
            {errorCreatingUser && <p className="text-red-500">Por favor completa todos los campos necesarios.</p>}
            <Table props={userTable} onClick={handleClick} />
        </div>
    </main>
);
}

