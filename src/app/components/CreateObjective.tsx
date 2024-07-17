import { cp } from "fs";
import { useRouter } from "next/navigation";
import { useState } from "react";




export default async function CreateObjective( nombre: string, id: number, cookies: any) {

    console.log('Crear Objetivo');

    const createOkr = async () => {	
        
    }

    console.log(id);


    try {
        const newObjetive = {
            name: nombre,
            okrDesignId:id,
        };
        console.log(newObjetive);
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/objective', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.access_token}`,
            },
            body: JSON.stringify(newObjetive),
        });
        const data = await response.json();
        console.log(data);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

