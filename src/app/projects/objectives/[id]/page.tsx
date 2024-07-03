"use client";

import { use, useState } from "react";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import ObjectivesTable from "@/app/components/GetObjectives";
import { useParams } from "next/navigation";
import { Route } from 'react-router-dom';
import { set } from "zod";

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



export default function Objectives({params,}:{params:{id:string}}) {
  const [cookies] = useCookies(["access_token"]);
  const [role, setRole] = useState("");
  const token = cookies.access_token;
  const [loading, setLoading] = useState(true);
  const [objectiveList, setObjectiveList] = useState<Objective[]>([]);

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

  useEffect(() => {
    const getObjectivesData = async () => {
     const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/objective?search_field=okrDesignId&search_text=' + params.id)
     const data = await response.json().then((data) => data);
      console.log(data);
      setObjectiveList(data.map((obj: { id: number; name: string; }) => ({
        id: obj.id,
        name: obj.name
      })));
      setLoading(false);
      console.log(objectiveList);
    }; getObjectivesData();
    }, []);

if (loading) {
    return <h1>Loading...</h1>;
}
console.log(objectiveList.map((objective) => [objective.id.toString(), objective.name]));

  return (
    <>
      {(role === "change_agents" ||
        role === "agile_coach" ||
        role === "project_leader" ||
        role === "admin") && (
        <ObjectivesTable
          role={role}
          objectivesInfo={objectiveList.map((objective) => [objective.id.toString(), objective.name])}
          projectInfo={projectsExample}
          okrDesignId={parseInt(params.id)}
        />
      )}
    </>
  );
}
