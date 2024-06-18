"use client";
import { GET } from "../api/auth/route";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import React from "react";
import { error } from "console";

export default function Logger(){
  async function getEvents(){
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/log",
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.access_token}`
        }
      }
    )
    if (!res.ok){
      throw new Error('Network response was not ok')
    }
    const data = await res.json();
    setValor(data)
  }
  const [cookies, setCookie] = useCookies(['access_token'	]);
  const [valor, setValor] = useState<any>([])
  interface EventObject {
    id: number;
    user_id: number;
    module: string;
    event: string;
    date: string;
  }

  useEffect(()=>{
    getEvents()
  },[])
  
return(
  <>
    <p className="flex items-center justify-center pt-10 font-bold text-xl">
      Logger de Eventos
    </p>
    <div className=" flex items-center justify-center pt-20"> 
      <table className=" p-15 border-spacing-30 border-2 border-white border-collapse">
        <thead>
          <tr className=" w-8% p-5 border-2 border-white border-collapse">
            <th className=" w-8% p-5 border-2 border-white border-collapse">Modulo</th>
            <th className=" w-8% p-5 border-2 border-white border-collapse">Evento</th>
            <th className=" w-8% p-5 border-2 border-white border-collapse">Fecha</th>
          </tr>
        </thead>
        <tbody className=" w-8% pt-2% border-2 border-white border-collapse pl-2% pb-2%">
          {valor.map((val:EventObject, index:any)=>(
            <tr key={index}>
              <td className=" w-8% p-5 border-2 border-white border-collapse">{val.module}</td>
              <td className=" w-8% p-5 border-2 border-white border-collapse">{val.event}</td>
              <td className=" w-8% p-5 border-2 border-white border-collapse">{val.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)
}
