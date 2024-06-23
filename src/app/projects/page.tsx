'use client';
import { use, useState } from "react";
import CreateProject from "../components/CreateProject";
import { useEffect } from "react";
import ProjectsTable from "../components/GetProjects";

type Project = {
    id: number;
    description: string;
    start: string;
    end: string;
    status:string;
}

export default function Projects() {

  const [loading, setLoading] = useState(true);
  const [projectList, setProjectList] = useState<Project[]>([]);


   useEffect(() => {
    const getProjectsData = async () => {
     const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/project')
     const data = await response.json().then((data) => data);
      console.log(data.projects);
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
        <ProjectsTable 
          projectInfo={projectList.map((project) => [project.id.toString(), project.description, project.start, project.end,project.status])}
        />
    );
}