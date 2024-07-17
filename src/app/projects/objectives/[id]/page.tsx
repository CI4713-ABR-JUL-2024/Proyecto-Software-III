"use client";

import { use, useState } from "react";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import ObjectivesTable from "@/app/components/GetObjectives";
import { useParams } from "next/navigation";
import { Route } from 'react-router-dom';
import { set } from "zod";
import { okrDesignService } from "@/backend/services/okrDesign";
import { compareSync } from "bcrypt";

type Objective = {
  id: number;
  name: string;
  okrDesignId: number;
};

type Project = {
  name: string;
  area: string;
};

type OkrDesign = {
  id: number;
  project_id: number;
};

const objectivesExample = [
  ["1", "Objective 1"],
  ["2", "Objective 2"],
  ["3", "Objective 3"],
];
const projectsExample = "Project 1";



export default function Objectives({ params }: { params: { id: string } }) {
  const [cookies] = useCookies(['access_token']);
  const [role, setRole] = useState('');
  const token = cookies.access_token;
  const [loading, setLoading] = useState(true);
  const [objectiveList, setObjectiveList] = useState<Objective[]>([]);
  const [projectName, setProjectName] = useState('');
  const [okrDesign, setOkrDesign] = useState<number | undefined>();

  const fetchOkrDesign = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/okrDesign?search_field=project_id&search_text=${params.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.id);
        setOkrDesign(data[0].id);
      } else {
        console.error('Error al obtener los datos del diseño de OKR');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt.decode(token, {}) as JwtPayload;
        setRole(decoded?.role_name || 'Rol no encontrado');
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchOkrDesign();
      console.log('params', params.id);
      console.log(okrDesign);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/objective?search_field=okrDesignId&search_text=${okrDesign}`
      );
      const data = await response.json();
      console.log(data);
      setObjectiveList(
        data.map((obj: { id: number; name: string }) => ({
          id: obj.id,
          name: obj.name,
        }))
      );
      setLoading(false);
      console.log(objectiveList);
    };

    fetchData();
  }, [okrDesign]);

  useEffect(() => {
    if (cookies.access_token != undefined) {
      fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/project/' + params.id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setProjectName(data.description);
          fetchOkrDesign();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      console.log('No hay token de acceso');
    }
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  console.log(objectiveList.map((objective) => [objective.id.toString(), objective.name]));
  console.log(okrDesign);

  return (
    <>
      {(role === 'change_agents' || role === 'agile_coach' || role === 'project_leader' || role === 'admin') && (
        <ObjectivesTable
          role={role}
          objectivesInfo={objectiveList.map((objective) => [objective.id.toString(), objective.name])}
          projectInfo={projectName}
          okrDesignId={okrDesign!!}
        />
      )}
    </>
  );
}