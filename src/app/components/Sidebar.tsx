'use client';
import { RiLogoutBoxRFill } from "react-icons/ri";
import { useCookies } from 'react-cookie';
import { useRouter } from "next/navigation";


export default function Sidebar(props: { role: string }) {
    const role = props.role;
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'id']);
    async function redirectProfile(){
        router.push("/profile");
    }

    async function viewUsers(){
        router.push("/users");
    }

    async function viewProjects(){
        router.push("/projects");
    }

    async function logOut(){
    removeCookie('access_token', { path: '/', domain: 'localhost' });
    router.push("/");
    }

    return (
    <aside className="mr-10 h-screen w-80 bext-white shadow-2xl rounded-sm p-6 flex flex-col justify-between">
        <div>
            <div className="flex items-center justify-center p-4">
                <h3 className="text-2xl font-bold text-[#3A4FCC]">Menu</h3> 
            </div>
                <div className="border-t border-gray-700 py-4 flex items-center flex-col">
                    <button
                        className="w-[-webkit-fill-available] hover:bg-[#3A4FCC] hover:text-white font-bold py-2 px-4 rounded-full"
                        onClick={redirectProfile}
                    >
                        Perfil
                    </button>

                    {role === 'admin' &&
                        <button
                            className="w-[-webkit-fill-available] hover:bg-[#3A4FCC] hover:text-white font-bold py-2 px-4 rounded-full"
                            onClick={viewUsers}
                        >
                            Perfiles de Usuarios
                        </button>
                    }
                    {(role === "admin" || role === "Gerente General" || role === "Gerente de Operaciones") &&
                        <button
                            className="w-[-webkit-fill-available] hover:bg-[#3A4FCC] hover:text-white font-bold py-2 px-4 rounded-full"
                            onClick={viewProjects}
                        >
                            Proyectos
                        </button>
                    }
                    {/* <button className="w-[-webkit-fill-available] hover:bg-[#3A4FCC] hover:text-white font-bold py-2 px-4 rounded-full">Ayuda</button> */}
                </div>
                
            </div>
        <div className="border-t border-gray-700 py-4 flex items-center flex-col">
            <button onClick={logOut} className="h-[65px] text-center inline-flex items-center justify-center w-[-webkit-fill-available] hover:bg-gray-200 font-bold px-5 py-2.5 rounded-full text-xl">
                <RiLogoutBoxRFill className="w-8 h-10 me-2" color="#3A4FCC" />
                Cerrar Sesion
            </button>
        </div>
        </aside>
    )
}