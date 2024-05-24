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
import Sidebar from "./components/Sidebar";
import { useCookies } from 'react-cookie';

//M123456#

type FormData = z.infer<typeof loginSchema>;


const Profile = () => {
  const router = useRouter();
  const [cookies, setCookie,removeCookie] = useCookies(['access_token'])
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
    fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user',{
      method: "GET" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"}})
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setName(data[0].name);
        setEmail(data[0].email);
        set_last_name(data[0].last_name)
        setPassword(data[0].password)
        setRole(data[0].role)
        setPhone(data[0].telephone)        
      });
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
  async function onChangePassword() {
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/changePassword',{
      method: "POST" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"} , // se pasa la contrasena encriptada
      body : JSON.stringify({oldPassword : password, newPassword : newPassword, compareNewPassword : newPassword}) , })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);        
      });
  }
  /*CHANGE PASSWORD
  useEffect(() => {
    console.log(cookies.access_token)
    console.log("Bearer "+cookies.access_token)
    fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/changePassword',{
      method: "POST" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"} , 
      body : JSON.stringify({oldPassword : "12345678", newPassword : "01234567", compareNewPassword : "01234567"}) , })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        
        setPhotos(data);
      });
  }, []);*/
  /*GET USERS
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user',{
      method: "GET" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        
        setPhotos(data);
      });
  }, []);*/
  /*CREAR USUARIO
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user',{
      method: "POST",body : JSON.stringify({ name : "Adelina", last_name : "Figueira", telephone : "04141594858", email : "adelina@mail.co", ci : "26.825.129", password : "12345678", role : "ROL"}), })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        
        setPhotos(data);
      });
  }, []);*/
  /*
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user',{
      method: "GET",})
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        console.log(register);
        const login = z.object({
          email: z.string().email(),
          password: z.string().min(8),
        });
        console.log(z.string().email());
        
        setPhotos(data);
      });
  }, []);*/
  /*
  async function onSubmit(data: FormData) {
    console.log(isSubmitting);
    //console.log(data);
    const {name,email,password,role} = data;
    const user = {name,email,password,role};
    const ci = "1234567";
    //console.log(user);
    const response = await fetch(
        new URL('api/user', process.env.NEXT_PUBLIC_BASE_URL),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      console.log(response)
  
      if (response.ok) {
        console.log('Usuario creado correctamente')
        router.push('/')
      } else {
        const data = await response.json()
        console.error(data.error_message)
      }

    }
  */

  return (
    <main>
    <nav
      role="navigation"
      className ="bg-slate-50 border-r border-slate-100 shadow-sm absolute inset-y-0 left-0"
    >
    <div className={`relative h-screen overflow-hidden`}>
      <div className="text-slate-500">
        <div className="my-8 flex flex-col items-center h-44 overflow-x-hidden">

            <div
              className="text-base font-semibold text-slate-700 mt-3 truncate duration-300"
            >
              CUENTA
            </div>
            <div
              className="text-base font-semibold text-slate-700 mt-3 ml-2 mr-2 truncate duration-300"
            >
              Maneja la información de tu cuenta
            </div>

            <div
              className="font-semibold text-slate-700 mt-3 truncate duration-300"
            >
              <button onClick={redirectProfile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                PERFIL
              </button>
            </div>

            <div
              className="text-base font-semibold text-slate-700 mt-3 truncate duration-300"
            >
              <button onClick={logOut} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded">
                CERRAR SESIÓN
              </button>
            </div>

        </div>
      </div>
    </div>
    </nav>
      <div style={{marginLeft : "20%"}}>
      
      <div style={{ position : "relative" }}>
      <div style={{ position : "absolute",
      top : "50%",
      left : "50%",
      transform : "translate(-50%, 80%)"}}>

      <div style={{ position : "absolute",
      top : "-0%",
      left : "0%",
      transform : "translate(-0%, -0%)"}}>
      <h1> Detalles del perfil </h1>
      </div>

      <div style={{ position : "absolute",
      top : "30%",
      left : "50%",
      transform : "translate(-50%, 30%)"}}>
      <FaRegUser className = "text-orange-500" style={{fontSize : "50px"}}/>
      </div>

      <div style={{ position : "absolute",
      top : "90%",
      left : "50%",
      transform : "translate(-50%, 90%)"}}>
      {name} {last_name}
      </div>

      <table style={{borderSpacing: "30px",transform : "translate(-0%, 140%)"}}>
      <tbody>
      <tr>
      <td style={{width : "40%", paddingTop : "2%"}} >Rol</td>
      <td style={{width : "40%", paddingTop : "2%"}}> {role} </td>
      </tr>
      <tr>
      <td style={{width : "40%", paddingTop : "2%"}}>Correo electrónico</td>
      <td style={{width : "40%", paddingTop : "2%"}}> {email} </td>
      </tr>
      <tr>
      <td style={{width : "40%", paddingTop : "2%"}}>Número de teléfono</td>
      <td style={{width : "40%", paddingTop : "2%"}}> {phone} </td>
      </tr>
      <tr>
      <td style={{width : "40%", paddingTop : "2%"}}>Contraseña</td>
      <td style={{width : "40%", paddingTop : "2%"}}> ******** <button onClick={redirectChangePassword}><FaPen style={{fontSize : "15px"}}/></button>  </td>
      </tr>
      </tbody>
      </table>
      </div>
      </div>

      </div>

    </main>
  );
}

export default Profile