'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateProjectProps {
    descripcion: string;
    inicio: string;
    cierre: string;
}



export default async function CreateProject( descripcion: string, inicio: string, cierre: string) {
    // constante para mostrar el modal de éxito
   // const [showModal, setShowModal] = useState(false);
  
   // async function onSubmitCreateProject(descripcion: string, inicio: string, cierre: string) {
      //console.log(data);
      //const {descripcion,inicio,cierre} = data;
  
      const a = { description : descripcion, start : inicio, end: cierre};
      console.log(a)
      const r = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/project',{
        method: "POST",body : JSON.stringify(a),
        })
        .then((res) => {
          if (res.status == 200){
            console.log("Proyecto creado con éxito");
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
