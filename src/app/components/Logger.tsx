"use client";
import { GET } from "../api/auth/route";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import React from "react";
import { error } from "console";
import { IoSearchCircle } from "react-icons/io5";

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
  const [loaded, setLoaded] = useState(false)
  const [valorMod, setValorMod] = useState<any>([])
  interface EventObject {
    id: number;
    user_id: number;
    module: string;
    event: string;
    date: string;
    hour: string;
  }

  useEffect(()=>{
    if (!loaded){
      getEvents()
      setLoaded(true)
    }
    valor.map((item:any)=>{
      const fecha = new Date(item.date)
      item.date = fecha.toLocaleDateString()
      item.hour = fecha.toLocaleTimeString()
    })
    console.log(valor)
    setValorMod(valor) 
  },[valor])
  
return(
  <>
    <div className="flex">
      <h3 className="pt-8 text-2xl font-bold text-[#3A4FCC]">
        Logger de Eventos
      </h3>
      <div className="flex items-end justify-end ml-24">
        <input 
          type="text" 
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar logger"
          />
        <button>
          <IoSearchCircle className="text-[#3A4FCC] w-10 h-10"/>
        </button>
      </div>
    </div>
    <div className=" flex items-center justify-center pt-4"> 
      <table className=" p-15 border-spacing-30 border-2 border-white border-collapse">
        <thead>
          <tr className=" w-8% p-5 border-2 border-white border-collapse">
            <th className=" w-8% p-5 border-2 border-white border-collapse">ID</th>
            <th className=" w-8% p-5 border-2 border-white border-collapse">Evento</th>
            <th className=" w-8% p-5 border-2 border-white border-collapse">Modulo</th>
            <th className=" w-8% p-5 border-2 border-white border-collapse">Fecha</th>
            <th className=" w-8% p-5 border-2 border-white border-collapse">Hora</th>
          </tr>
        </thead>
        <tbody className=" w-8% pt-2% border-2 border-white border-collapse pl-2% pb-2%">
          {valorMod.map((val:EventObject, index:any)=>(
            <tr key={index}>
              <td className=" w-8% p-5 border-2 border-white border-collapse">{val.id}</td>
              <td className=" w-8% p-5 border-2 border-white border-collapse">{val.event}</td>
              <td className=" w-8% p-5 border-2 border-white border-collapse">{val.module}</td>
              <td className=" w-8% p-5 border-2 border-white border-collapse">{val.date}</td>
              <td className=" w-8% p-5 border-2 border-white border-collapse">{val.hour}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)
}
