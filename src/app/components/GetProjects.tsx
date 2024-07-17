"use client";
import { FaPen, FaTrash, FaPrint, FaPlus, FaStop } from "react-icons/fa";
import Table from "../components/ProjectTable";
import { IoSearchCircle } from "react-icons/io5";
import { use, useState } from "react";
import Sidebar from "../components/Sidebar";
import CreateProject from "../components/CreateProject";
import { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import ApproachModal from "./ApproachModal";
import InactivateProject from "./InactiveProject";

type ProjectsTableProps = {
  projectInfo: string[][];
  role: string;
};

export default function ProjectsTable({
  projectInfo,
  role,
}: ProjectsTableProps) {
  const [searchVal, setSearchVal] = useState("");
  const [addProject, setAddProject] = useState(false);
  const [errorCreatingProject, setErrorCreatingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<string[] | null>(null);
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editInicio, setEditInicio] = useState("");
  const [editCierre, setEditCierre] = useState("");
  const [cookies, setCookie] = useCookies(["access_token", "id"]);
  const [trimester, setTrimester] = useState("");
  const [year, setYear] = useState("");
  const [organization, setOrganization] = useState<any>(undefined);
  const [approach, setApproach] = useState<any>(undefined);
  const [area, setArea] = useState("");
  const [approachList, setApproachList] = useState<any>([]);
  const [organizationList, setOrganizationList] = useState<any>([]);
  const [addApproach, setAddApproach] = useState(false);
  const [trimVal, setTrimVal] = useState(false);

  const router = useRouter();


  // handles fucntions
  const handleCreateProject = async () => {
    if (!trimester || !year || !organization || !approach || !area) {
      console.error("Por favor completa todos los campos.");
      setErrorCreatingProject(true);
      return;
    }
    const trimestresValidos = ["enero-marzo", "febrero-abril", "marzo-mayo", "abril-junio",
      "mayo-julio", "junio-agosto", "julio-septiembre", "agosto-octubre", "septiembre-noviembre",
      "octubre-diciembre","noviembre-enero","diciembre-febrero"
    ]
    const trim_min = trimester.toLowerCase()
    for(var i =0; i<trimestresValidos.length; i++){
      if(trimestresValidos[i]==trim_min){
        setTrimVal(true)
        break
      }
      return
    }
    setAddProject(false);
    console.log(trimester, year, organization, approach, area);
    if (errorCreatingProject) {
      setErrorCreatingProject(false);
    }

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); // Normalizamos el valor del mes (0-11)
    const thisYear = today.getFullYear();
    const nextYear = thisYear + 1;
    const start = new Date(thisYear, month, day); // Restamos 1 al mes para que sea compatible con el rango 0-11
    const end = new Date(nextYear, month, day);
    
    console.log(start, end);
    const creatOkr = async (newProjectId: number) => {
      console.log("Crear Okr");
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/okrDesign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.access_token}`,
        },
        body: JSON.stringify({
          project_id: newProjectId,
        }),
      })
      if (response.ok) {
        console.log("OKR creado");
        const data = await response.json();
        return data;
      } else {
        console.error("Error al crear OKR");
        return null;
      }
    }

    try {
      const newProject = {
        description: "Falta descripcion",
        trimester: trimester,
        year: year,
        start: start,
        end: end,
        organization_id: Number(organization),
        aproach_id: Number(approach),
        area: area,
      };
      console.log(newProject);
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/project",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.access_token}`,
          },
          body: JSON.stringify(newProject),
        }
      );
      const data = await response.json();
      console.log(data);
      creatOkr(data.id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (projectInfo === undefined) {
    projectInfo = [
      [
        "1",
        "Proyecto 1",
        "2024-06-11T00:00:00.000Z",
        "2024-06-11T00:00:00.000Z",
        "ACTIVE",
      ],
      [
        "2",
        "Proyecto 2",
        "2024-06-11T00:00:00.000Z",
        "2024-06-11T00:00:00.000Z",
        "ACTIVE",
      ],
    ];
  }

  const tableProp = {
    header: ["ID", "Descripción" , "Fecha de Inicio", "Fecha de Cierre"],
    // info: [ [ '2', 'abril julio', 'ano', 11, 'ACTIVE' ] ],
    info: projectInfo,
    buttons: [FaPen, FaTrash, FaPrint, FaPlus, FaStop],

    buttons_message: [
      "Editar",
      "Eliminar",
      "Imprimir",
      "Generar",
      "Deshabilitar",
    ],
  };
  const [projectTable, setProjectTable] = useState(tableProp);
  const handleClick = async (e: any, id: string[]) => {
    //e number of button on list
    //id position of user in info list
    //console.log(e);
    if (e == 0) {
      //Editar proyecto
      console.log("Editar");
      setEditingProject(id);
      setEditDescripcion(id[1]);
      setEditInicio(id[2]);
      setEditCierre(id[3]);
    }
    if (e == 1) {
      //Eliminar proyecto
      console.log("Eliminar");
      try {
        const projectId = id[0];
        const response = await fetch(`/api/project/${projectId}`, {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.access_token}`,
            type: "text",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        //Actualizar pagina luego de eliminar proyecto
        const updatedProjectInfo = projectInfo.filter(
          (project) => project[0] !== projectId
        );
        setProjectTable((prevState) => ({
          ...prevState,
          info: updatedProjectInfo,
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    }
    if (e == 2) {
      //setCurrentProject(id);
      //handlePrint();
      window.print();
    }
    if (e == 3) {
        router.push('/projects/objectives/'+id[0].toString());
    }
    if (e == 4) {
      console.log("Deshabilitar");
      InactivateProject(id[0], cookies);
    }

    //rellenar con el manejo del click hecho dependiendo del boton y el usuario
  };

  function handleSearchClick() {
    if (searchVal === "") {
      setProjectTable(tableProp);
      return;
    }
    const filterBySearch = tableProp.info.filter((item) => {
      if (item.includes(searchVal)) {
        return item;
      }
    });
    setProjectTable({
      header: tableProp.header,
      info: filterBySearch,
      buttons: tableProp.buttons,
      buttons_message: tableProp.buttons_message,
    });
  }

  // get info fields selects
  async function getOrganizationsData() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/organization",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
            type: "text",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setOrganizationList(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getApproachs() {
    console.log("Se obtuvieron los abordajes");
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/approach",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setApproachList(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    getApproachs();
    getOrganizationsData();
  }, []);

  return (
    <main className="flex">
      <Sidebar role="admin" />
      <div className="m-10 flex flex-col w-full">
        <div className="flex justify-between w-full p-4">
          <h3 className="text-2xl font-bold text-[#3A4FCC]">
            Portafolio de Proyetos de OKRs
          </h3>
          <div className="flex w-1/3">
            <input
              type="text"
              placeholder="Buscar proyecto"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button>
              <IoSearchCircle
                className="text-[#3A4FCC] w-10 h-10"
                onClick={handleSearchClick}
              />
            </button>
            <button
              onClick={() => setAddProject(true)}
              className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full"
            >
              Crear Proyecto
            </button>
            <button
              onClick={() => setAddApproach(true)}
              className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full"
            >
              Modificar abordajes
            </button>
            <button
              onClick={() => router.push("/projects/statusObjectives")}
              className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full"
            >
              Estatus de objetivos
            </button>
          </div>
        </div>
        {addProject && (
          <div className="flex p-5">
            <input
              id="trimester"
              type="text"
              value={trimester}
              placeholder="Trimestre"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
              onChange={(e) => {
                setTrimester(e.target.value);
              }}
              required
            />
            <input
              id="year"
              type="year"
              value={year}
              placeholder="Año"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
              onChange={(e) => setYear(e.target.value)}
            />
            <select
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="border invalid:text-gray-400  border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
              required
            >
              <option disabled className="text-gray-400" value="">
                Seleccione una organización
              </option>
              {organizationList.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              id="approach"
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              className="border invalid:text-gray-400 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
              required
            >
              <option disabled className="text-gray-400" value="">
                Seleccione un abordaje
              </option>
              {approachList.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              id="area"
              type="text"
              value={area}
              placeholder="Área"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
              onChange={(e) => setArea(e.target.value)}
              required
            />

            <button
              type="submit"
              className="bg-[#3A4FCC] text-white font-bold py-2 px-5 rounded-full"
              onClick={() => handleCreateProject()}
            >
              Crear
            </button>
          </div>
        )}

        {editingProject && (
          <div className="flex p-5">
            <input
              id="editDescripcion"
              type="text"
              value={editDescripcion}
              placeholder="Descripción del proyecto"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
              onChange={(e) => {
                setEditDescripcion(e.target.value);
              }}
              required
            />
            <input
              id="editInicio"
              type="date"
              value={editInicio}
              placeholder="Fecha de inicio"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
              onChange={(e) => {
                setEditInicio(e.target.value);
              }}
              required
            />
            <input
              id="editCierre"
              type="date"
              value={editCierre}
              placeholder="Fecha de cierre"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5"
              onChange={(e) => {
                setEditCierre(e.target.value);
              }}
              required
            />

            <button
              type="button"
              className="bg-[#3A4FCC] text-white font-bold py-2 px-5 rounded-full"
              onClick={async () => {
                if (!editDescripcion || !editInicio || !editCierre) {
                  console.error("Por favor completa todos los campos.");
                  setErrorCreatingProject(true);
                  return;
                }
                console.log(editDescripcion, editInicio, editCierre);
                console.log(cookies.access_token);
                const projectId = editingProject[0];
                const response = await fetch(`/api/project/${projectId}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies.access_token}`,
                    type: "text",
                  },
                  body: JSON.stringify({
                    description: editDescripcion,
                    start: editInicio,
                    end: editCierre,
                  }),
                });

                if (!response.ok) {
                  console.error(`HTTP error! status: ${response.status}`);
                  const errorText = await response.text();
                  console.error("Error body:", errorText);
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);

                setEditingProject([
                  projectId,
                  editDescripcion,
                  editInicio,
                  editCierre,
                  "ACTIVE",
                ]);
                setEditingProject(null);
              }}
            >
              Guardar
            </button>
          </div>
        )}

        {errorCreatingProject && (
          <p className="text-red-500">
            Por favor completa todos los campos necesarios.
          </p>
        )}
        {!trimVal && (
          <p className="text-red-500">
            Se debe ingresar un periodo de tres meses sin espacios, pj "enero-marzo"
          </p>
        )}
        <ApproachModal isOpen={addApproach} setIsOpen={setAddApproach} />
        <Table role={role} props={projectTable} onClick={handleClick} />
      </div>
    </main>
  );
}
