"use client";

import { use, useState } from "react";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Table from "@/app/components/GenericTable";
import {FaPen, FaTrash} from "react-icons/fa";
import Sidebar from "@/app/components/Sidebar";
import { useParams } from "next/navigation";
import { Route } from 'react-router-dom';
import { set } from "zod";

export default function statusObjectives(){
    const [cookies] = useCookies(["access_token"]);
    const [role, setRole] = useState("");
    const token = cookies.access_token;
  
    useEffect(() => {
      if (token) {
        try {
          const decoded = jwt.decode(token, {}) as JwtPayload;
          // Assuming setRole is a state setter function for role
          setRole(decoded?.role_name || "Rol no encontrado");
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      }
    }, [token]);

    const datosEjemplo = [["1", "Objetivo 1","Completado"], ["2","Objetivo 2", "En Desarrollo"]]

    const handleClick = (e: any, id: string[]) => {
        console.log(e);
        console.log(id);
    }
    const tableProps = {
        header: ['ID','Objetivo', 'Status'],
        info: datosEjemplo,
        buttons: [FaPen, FaTrash],
        buttons_message: ['Editar Objetivo', 'Eliminar Objetivo'],
    };

    return (
        <>
        <main className='flex'>
        <Sidebar role={role.toString()}/>
        <div className="m-10 flex flex-col w-full">
                <div className="flex justify-between w-full p-4">
                    <h3 className="text-2xl font-bold text-[#3A4FCC]">Estatus de objetivos</h3>
                </div>
      {(role === "admin") && (
        <Table
          props={tableProps}
          onClick={handleClick}
        />
      )}
    </div>

      </main>
    </>
    );

}