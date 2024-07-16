'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";


export default async function InactivateProject( id: string, cookies: any) {
    // constante para mostrar el modal de éxito
   // const [showModal, setShowModal] = useState(false);
  
   // async function onSubmitCreateProject(descripcion: string, inicio: string, cierre: string) {
      //console.log(data);
      //const {descripcion,inicio,cierre} = data;
  
      const a = { status : "INACTIVE"};
      console.log(a)
      console.log(id)
      const r = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/project/'+id,{
        method: "PUT",body : JSON.stringify(a),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.access_token}`,
            type: "text",
          },
        })
        .then((res) => {
          if (res.status == 200){
            console.log("Proyecto desactivado con éxito");
          }
          return res.json();
        })
        .then((data) => {
          if (data!=undefined){
            console.log(data);
          };
        });
  
     // }
}