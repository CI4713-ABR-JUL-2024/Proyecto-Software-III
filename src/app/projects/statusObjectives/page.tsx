"use client";

import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Table from "@/app/components/GenericTable";
import { FaPen, FaTrash } from "react-icons/fa";
import Sidebar from "@/app/components/Sidebar";

export default function StatusObjectives() {
  const [cookies] = useCookies(["access_token"]);
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [okr, setOkr] = useState<any[]>([]);
  const [objectives, setObjectives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [compObj, setCompObj] = useState<any[]>([]);
  const token = cookies.access_token;

  const fetchOkrDesign = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/okrDesign`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });

    if (response.ok) {
      return response.json();
    } else {
      console.error('Error al obtener los datos del diseño de OKR');
      return [];
    }
  };

  const fetchProjects = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });

    if (response.ok) {
      return response.json();
    } else {
      console.error('Error al obtener los datos de los proyectos');
      return [];
    }
  };

  const fetchObjectives = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/objective`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });

    if (response.ok) {
      return response.json();
    } else {
      console.error('Error al obtener los datos de los objetivos');
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [okrData, projectsData, objectivesData] = await Promise.all([
          fetchOkrDesign(),
          fetchProjects(),
          fetchObjectives(),
        ]);

        setOkr(okrData);
        setProjects(projectsData.projects);
        setObjectives(objectivesData);

        // Realizar operaciones con los datos obtenidos
        const result = groupObjectivesByProjects(objectivesData, projectsData, okrData);
        console.log(result);
        if(result.length>0 && !isLoading){
          setCompObj(result);
          setIsLoading(true);
        }

      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchData();
  }, [cookies.access_token, compObj, isLoading]);

  const handleClick = (e: any, id: string[]) => {
    console.log(e);
    console.log(id);
  };

  return (
    <>
      <main className='flex'>
        <Sidebar role={role.toString()} />
        <div className="m-10 flex flex-col w-full">
          <div className="flex justify-between w-full p-4">
            <h3 className="text-2xl font-bold text-[#3A4FCC]">Objetivos Completados Por Proyectos</h3>
          </div>
          {compObj.map((projObj:any, index:number)=>{
            return(
              <div key={index} className="flex flex-col">
                <div className="flex flex-row rounded-md bg-blue-100 p-4 m-4 shadow-md shadow-slate-600 font-bold">
                  <p className="mr-16">{projObj.project}</p>
                  <p>{`${projObj.completed}/${projObj.count}`}</p>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  );
}


function groupObjectivesByProjects(objectives: any[], projects: any, okrs: any[]) {
  const projectMap = new Map<number, any>();
  projects.projects.forEach((project: any) => {
    projectMap.set(project.id, { project: project.description, count: 0, completed: 0 });
  });

  const okrMap = new Map<number, number>();
  okrs.forEach((okr: any) => {
    okrMap.set(okr.id, okr.project_id);
  });

  objectives.forEach((objective: any) => {
    const projectId = okrMap.get(objective.okrDesignId);
    if (projectId !== undefined) {
      const projectInfo = projectMap.get(projectId);
      if (projectInfo) {
        projectInfo.count += 1;
        if (objective.completed) {
          projectInfo.completed += 1;
        }
      }
    }
  });

  return Array.from(projectMap.values());
}