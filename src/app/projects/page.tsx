"use client";
import { use, useState } from "react";
import CreateProject from "../components/CreateProject";
import { useEffect } from "react";
import ProjectsTable from "../components/GetProjects";
import { useCookies } from "react-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import LeaderProjectTable from "../components/LeaderProjectTable";

type Project = {
  id: number;
  description: string;
  start: string;
  end: string;
  status: string;
  aproach_id: string;
  organization_id: string;
  trimester: string;
  year: string;
  area: string;
};

export default function Projects() {
  const [organizationList, setOrganizationList] = useState<any>([]);
  const [cookies] = useCookies(["access_token"]);
  let role = "";
  const token = cookies.access_token;
  console.log(role);
  console.log(cookies);
  const [loading, setLoading] = useState(true);
  const [projectList, setProjectList] = useState<Project[]>([]);

  if (token) {
    try {
      const decoded = jwt.decode(token, {}) as JwtPayload;
      role = decoded?.role_name || "Rol no encontrado";
      console.log(role);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  }




  useEffect(() => {
    const getProjectsData = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/project"
      );
      const data = await response.json().then((data) => data);
      console.log(data.projects);
      setProjectList(data.projects);
      setLoading(false);
    };
    getProjectsData();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  // console.log(projectList?.map((project) => [project.id.toString(), project.description, project.start, project.end,project.status]));


  console.log(organizationList)
  return (
    <>
      {(role === "change_agents" ||
        role === "agile_coach" ||
        role === "project_leader") && <LeaderProjectTable role={role} />}
      {(role === "admin" ||
        role === "general_management" ||
        role === "operations_management") && (
        <ProjectsTable
          role={role}
          projectInfo={projectList?.map((project) => [
            project.id.toString(),
            project.description,
            project.start,
            project.end,
            project.status,
          ])}
        />
      )}
    </>
  );
}
