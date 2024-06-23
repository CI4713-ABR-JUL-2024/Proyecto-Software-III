'use client';
import React from 'react'
import Button from '../components/Button'
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema } from "@/zodSchema/login";
import { useState, useEffect } from 'react';
import { FaRegUser, FaPen, FaCircle} from "react-icons/fa";
import { useCookies } from 'react-cookie';

//M123456#

import Sidebar from '../components/Sidebar'


type FormData = z.infer<typeof loginSchema>;

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

const Profile = () => {
  const router = useRouter();
  const [cookies, setCookie,removeCookie] = useCookies(['access_token','id'])
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });
  const [name, setName] = useState("");
  const [last_name, set_last_name] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword,setNewPassword] = useState("");

  useEffect(() => {
    console.log(cookies.access_token)
    if (cookies.access_token != undefined){
      fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user/'+cookies.id,{
      method: "GET" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"}})
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        setName(data.name);
        setEmail(data.email);
        set_last_name(data.last_name)
        setPassword(data.password)
        setRole(data.role_name)
        setPhone(data.telephone)        
      }).catch(error => {
        console.error('error', error);
      
      })
    }
    else{
      router.push("/");
    }
    
  }, []);
  async function redirectChangePassword(){
    router.push("/change");
  }

  async function redirectProfile(){
    router.push("/profile");
  }

  async function logOut(){
    removeCookie('access_token', { path: '/', domain: 'localhost' });
    router.push("/");
  }


  return (
    <main className="flex">
    <Sidebar role={role}/>

    <div className="m-10 flex flex-col w-full">
            <div className="flex flex-col space-y-15 w-full p-4">
                <h3 className="text-2xl font-bold text-[#3A4FCC]">Detalles del perfil</h3>
                <div className="flex flex-col space-y-10"> 

                  <div className="flex justify-center items-center">
                  <FaRegUser className = "text-orange-500" style={{fontSize : "70px"}}/>
                  </div>

                  <div className="flex justify-center items-center" style={{fontSize : "20px"}}>
                  {name} {last_name}
                  </div>

                  <div className="flex justify-center items-center">
                  <table className="border-separate border-spacing-x-4" style={{borderSpacing: "30px"}}>
                  <tbody>
                  <tr>
                  <td  >Rol</td>
                  <td > {getRoleName(role)} </td>
                  </tr>
                  <tr>
                  <td >Correo electrónico</td>
                  <td > {email} </td>
                  </tr>
                  <tr>
                  <td >Número de teléfono</td>
                  <td > {phone} </td>
                  </tr>
                  <tr>
                  <td >Contraseña</td>
                  <td > ******** <button onClick={redirectChangePassword}><FaPen style={{fontSize : "15px"}}/></button>  </td>
                  </tr>
                  </tbody>
                  </table>
                  </div>

                </div>
            </div>
    </div>

    </main>
  );
}

export default Profile