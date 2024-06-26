'use client'

import { use, useState } from "react";
import { useEffect } from "react";
import { useCookies } from 'react-cookie';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ObjectivesTable from "@/app/components/GetObjectives";

type Objective = {
    id: number;
    name: string;
    projectid: number;
}

type Project = {
    name: string;
    area: string;
}


const objectivesExample = [['1', 'Objective 1'], ['2', 'Objective 2'], ['3', 'Objective 3']]
const projectsExample = ['Project 1', 'Area 1']

export default function Objectives() {
    const [cookies] = useCookies(['access_token']);
    let role = '' ;
    const token = cookies.access_token;
    console.log(role)
    console.log(cookies)
    const [loading, setLoading] = useState(true);
    const [objectList, setObjecttList] = useState<Objective[]>([]);
  
    if (token) {
      try {
        const decoded = jwt.decode(token, {}) as JwtPayload;
        role = decoded?.role_name || 'Rol no encontrado';
        console.log(role);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }

    return (
        <>
        {(role === 'change_agents' || role === 'agile_coach' || role === 'project_leader' || role === 'admin' ) && 
        <ObjectivesTable role={role} objectivesInfo={objectivesExample} projectInfo={projectsExample} />
        }
        </>
    );
}