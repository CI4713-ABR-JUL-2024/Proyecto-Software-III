'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";




export default async function CreateObjective( nombre: string, id: number, cookies: any) {
    // constante para mostrar el modal de éxito
   // const [showModal, setShowModal] = useState(false);
  
   // async function onSubmitCreateProject(descripcion: string, inicio: string, cierre: string) {
      //console.log(data);
      //const {descripcion,inicio,cierre} = data;
  
      console.log('Crear Proyecto');
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth(); // Normalizamos el valor del mes (0-11)
        const thisYear = today.getFullYear();
        const nextYear = thisYear + 1;
        const start = new Date(thisYear, month, day); // Restamos 1 al mes para que sea compatible con el rango 0-11
        const end = new Date(nextYear, month, day);
               

        console.log(start, end);

        try {
            const newProject = {
                name: nombre,
                okrDesignId:id,
            };
            console.log(newProject);
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/objective', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`,
                },
                body: JSON.stringify(newProject),
            });
            const data = await response.json();
            console.log(data);
            
        } catch (error) {
            console.error('Error:', error);
        }
    }
  
     // }
