'use client';
import { use, useState } from "react";
import CreateProject from "../components/CreateProject";
import { useEffect } from "react";
import ProjectsTable from "../components/GetProjects";
import Sidebar from "../components/Sidebar"
import { useRouter } from "next/navigation";
import { FaRegUser, FaPen, FaCircle} from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import { useCookies } from 'react-cookie';
import Table from "../components/Table";

import settings from './settings.json';


interface AddProps {
  role : string,
  ID : any,
  placeholders: Array<string>,
  ids: Array<string>,
  types : Array<string>,
  save : any,
  valuesOf : Array<string>,
}

const Add = ({role, ID, valuesOf, placeholders,ids,types,save} : AddProps) => {
  const pc = placeholders;
  const newid = ID;
  const id = ids;
  const type = types;
  const onSave = save;
  const [info,setInfo] = useState(valuesOf);
  const [errorCreatingProject, setErrorCreatingProject] = useState(false);

  function handleEdition(index : number,value : string) {
    const nextInfo = info.map((c, i) => {
      if (i === index) {
        return value;
      } else {
        return c;
      }
    });
    setInfo(nextInfo);
  }
  function allFieldsFilled(){
    for (let i = 0; i < info.length; i++) {
      console.log (info[i]);
      if (info[i] == ""){
        return false;
      }
    }
    return true;
  }

  return (
  <>
    <div className="flex p-5">
          <input 
              key="inputnumberid"
              id="numberid"
              type="text"
              value={newid}
              placeholder={newid}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5" 
              readOnly
          />
          {pc.map((B,j) => {
              if (role === "admin") {
                return (<input 
                    key={"inputnew"+j}
                    id={id[j]+j}
                    type={type[j]}
                    value={info[j]}
                    placeholder={B}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5" 
                    onChange={(e) => { handleEdition(j,e.target.value) }}
                    required
                />)
              }
            }
            
            )}               
               
            <button
                type="submit"
                className="bg-[#3A4FCC] text-white font-bold py-2 px-5 rounded-full"
                onClick={() => {
                  console.log(allFieldsFilled());
                    if (!allFieldsFilled()) {
                        console.error("Por favor completa todos los campos.");
                        setErrorCreatingProject(true);
                        return;
                    }
                    if (errorCreatingProject) setErrorCreatingProject(false);
                    onSave(info);
                }}
            >
                Crear
            </button>
    </div>
    {errorCreatingProject && <p className="text-red-500">Por favor completa todos los campos necesarios.</p>}
  </>
  );
}

interface TableHeaderProps {
  title : string,
  placeholder: string,
  handleSearchClick: any,
  setAdd : any,
  name : string,
}

const TableHeader = ({title,placeholder,handleSearchClick,setAdd,name}:TableHeaderProps) => {
  const [searchVal, setSearchVal] = useState("");
  return (
  <>
  <div className="flex justify-between w-full p-4">
      <h3 className="text-2xl font-bold text-[#3A4FCC]">{title}</h3>
      <div className="flex w-1/3"> 
          <input
              type="text"
              placeholder={placeholder}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => setSearchVal(e.target.value)}
          />
          <button onClick={()=>handleSearchClick(searchVal)}>
              <IoSearchCircle className="text-[#3A4FCC] w-10 h-10" />
          </button>
          <button onClick={() => setAdd(true)}
              className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full">{name}</button>
      </div>
  </div>
  </>
  );
}

interface TablePageProps {
  information : any,
  data: string[][],
  role: string,
  buttons : Array<any>,
  click : any,
  search : any,
  save : any,
  editF : any,
  deleteF:any,
}

const TablePage = ({information,data,role,buttons,click,search,save,editF,deleteF}:TablePageProps) => {
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editing, setEditing] = useState<string[] | null>(null);
  const importing = information
  const [valuesOf, setValuesOf] = useState(Array(importing.tableHeader.length-1).fill(""));

  const propsc = {
    header : importing.tableHeader , 
    info : data,
    buttons: buttons, 
    buttons_message: importing.buttons_message}

  const newId = parseInt(propsc.info[propsc.info.length-1][0])+1;

  const handleClick = async (e: any,id: any) => {
    //when the buttons inside the table are clicked
    console.log(e)
    console.log(id)
    if (importing.buttons_message[e] == "Edit"){
      setEdit(true);
      setEditing(id);
      console.log(propsc.info)
      console.log(propsc.info[id]);
      setValuesOf(propsc.info[id]);
    }
    if (importing.buttons_message[e] == "Delete"){
      console.log("deleting organization")
      deleteF(id);
    }
    click(e,id);
  }

  const onSearch = async (value : string) =>{
    search(value);
  }

  const onSave = async (info : Array<string>) =>{
    save(info);
  }
  const onEdit = async (info : Array<string>) => {
    editF(info);
  }

  return (
    <main className="flex">
        <Sidebar role={role} />
        <div className="m-10 flex flex-col w-full">

        <TableHeader title={importing.title} placeholder={importing.search} 
        handleSearchClick={onSearch} setAdd={setAdd} name={importing.name}/>
            
        {add && <Add role={role} ID={newId} valuesOf={valuesOf} placeholders={importing.placeholders} 
        ids={importing.ids} types={importing.types} save={onSave}/>}
            
        {edit && <Add role={role} ID={editing} valuesOf={valuesOf} placeholders={importing.placeholders} 
        ids={importing.ids} types={importing.types} save={onEdit}/>}
            
        <Table props={propsc} onClick={handleClick}/>
        </div>
    </main>
);
}

export default function Organizations() {
  //const [tableInfo, setTableInfo] = useState<string[][]>([]);
  const tableInfo =  [["1","Adelina","Figueira","Admin","User","User","User"],
      ["2","Adelina","Figueira","Admin","User","User","User"]];
  const [role, setRole] = useState("");
  const [cookies, setCookie] = useCookies(["access_token","id"]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (cookies.access_token != undefined){
      fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user/'+cookies.id,{
      method: "GET" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"}})
      .then(res => {
        return res.json();
      })
      .then(data => {
        //setRole(data.role_name)
        setRole("admin")
      }).catch(error => {
        console.error('error', error);
      })
    }
    else{
      router.push("/");
    }
    const getOrganizationsData = async () => {
     const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/organization',{
      method: "GET" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"}})
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        //setTableInfo(data);
        setLoading(false);       
      }).catch(error => {
        console.error('error', error);
      })
    };
    getOrganizationsData();
    
  }, []);

  const handleClick = async (e: any,id: any) => {
    console.log(e)
  }

  const onSearch = async (value : string) =>{
    //handle search after pressing button
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/organization?search='+value,{
      method: "GET" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"}})
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        //setTableInfo(data);
      }).catch(error => {
        console.error('error', error);
    })
    console.log(value);
  }

  const onSave = async (info : Array<string>) =>{
    //handle saving organization

    // ["ID","Nombre","País","Estado","Responsable","Teléfono","Correo electrónico"]
    console.log(info);

    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/organization',{
      method: "POST" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"} , // se pasa la contrasena encriptada
      body : JSON.stringify({name : info[0], country : info[1], estate : info[2], email : info[5], 
        cellphone:info[4], personResponsible : info[3]}),})
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);        
      });
  }
  const onEdit = async (info : Array<string>) => {
    console.log(info)
    //handle edition
    const id = info[0]
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/organization/'+id,{
      method: "PUT" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"} , // se pasa la contrasena encriptada
      body : JSON.stringify({name : info[1], country : info[2], estate : info[3], email : info[6], 
        cellphone:info[5], personResponsible : info[4]}),})
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);        
      });
  }
  const onDelete = async (id : any) => {
    console.log(id)
    //handle edition
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/organization/'+id,{
      method: "DELETE" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"} ,})
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);        
      });
  }

  return(
    <TablePage information={settings.organization} data={tableInfo} buttons={[FaPen,FaCircle]}
    click = {handleClick} search={onSearch} save={onSave} editF={onEdit} deleteF={onDelete} role={role}/>
    );
}
