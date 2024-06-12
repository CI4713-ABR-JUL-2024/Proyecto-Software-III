'use client';
import { FaPen, FaTrash, FaPrint, FaFilePdf,FaPlay } from "react-icons/fa";
import Table from "../components/Table";
import { IoSearchCircle } from "react-icons/io5";
import { use, useState } from "react";
import Sidebar from "../components/Sidebar"
import CreateProject from "../components/CreateProject";
import { useEffect } from "react";
import ProjectsTable from "../components/GetProjects";

type Project = {
    id: number;
    description: string;
    start: string;
    end: string;
}

export default function Projects() {
  const [searchVal, setSearchVal] = useState("");
  const [addProject, setAddProject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [descripcion, setDescripcion] = useState('');
  const [inicio, setInicio] = useState('');
  const [cierre, setCierre] = useState('');
  const [errorCreatingProject, setErrorCreatingProject] = useState(false);
  const [projectList, setProjectList] = useState<Project[]>([]);
  //const [projectInfo, setProjectInfo] = useState<string[][]>([]);

   useEffect(() => {
    const getProjectsData = async () => {
     const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/project')
     const data = await response.json().then((data) => data);
      //console.log(data.projects);
      setProjectList(data.projects);
      //console.log(data.projects);
      setLoading(false);
      //setProjectInfo(projectList.map((project) => ["1", project.description, project.start, project.end]))
      //console.log(projectInfo);
    }; getProjectsData();
    }, []);

   if(loading){
    return <h1>Loading...</h1>
  }

  return (
    <ProjectsTable projectInfo={projectList.map((project) => [project.id.toString(), project.description, project.start, project.end])}/>
);
}