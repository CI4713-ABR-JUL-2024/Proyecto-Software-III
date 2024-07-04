'use client';
import { use, useState } from "react";
import CreateProject from "../components/CreateProject";
import { useEffect } from "react";
import ProjectsTable from "../components/GetProjects";
import Sidebar from "../components/Sidebar"
import { useRouter } from "next/navigation";
import { FaRegUser, FaPen, FaCircle, FaTrash} from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import { useCookies } from 'react-cookie';
import Table from "../components/Table";
import DeleteModal from "./DeleteModal"
import jwt, { JwtPayload } from 'jsonwebtoken';

import settings from './settings.json';


interface AddProps {
  role : string,
  ID : any,
  placeholders: Array<string>,
  ids: Array<string>,
  types : Array<string>,
  save : any,
  valuesOf : Array<string>,
  handleClosing : any,
}

const Add = ({role, ID, valuesOf, placeholders,ids,types,save,handleClosing} : AddProps) => {
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

  function idFound(){
    if (id != null){
      return (<div key={"id"}>
              <input 
                    key="inputnumberid"
                    id="numberid"
                    type="text"
                    value={newid}
                    placeholder={newid}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5" 
                    readOnly
                  />
              </div>)
    }
  }

  function mapping(){
    console.log(pc)
    var found : Array<any> = []
    pc.map((B,j) => {
      if (role === "admin" || role == 'project_leader') {
        console.log(B)
        console.log(j)
        found.push(
        <div key={"inputdiv"+j}>
        <input 
            key={"inputnew"+j}
            id={id[j]+j}
            type={type[j]}
            value={info[j]}
            placeholder={B}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5" 
            onChange={(e) => { handleEdition(j,e.target.value) }}
            required
        />
        </div>
        )
      }
    })
    return found;
  }

  return (
  <>
    <div className="flex flex-wrap p-5 bg-gray-300">
        
        
        {mapping()}
            
        <div key={"buttondivsave"}>
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
        <div key={"div3"}></div>
        <div key={"div4"}></div>
        <div key={"div5"}></div>

        <div className="grow" key={"divbuttonclose"}><button onClick={handleClosing}> X </button></div>
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
  const [isOpen,setModalOpen] = useState(false);
  const [text, setText] = useState("¿Estás seguro de eliminar la organización?");
  const [deleteID,setDeleteID] = useState(0);
  const router = useRouter();

  const propsc = {
    header : importing.tableHeader , 
    info : data,
    buttons: buttons, 
    buttons_message: importing.buttons_message}

  const handleValue = () : number => {
    if (data.length == 0){
      return 0
    }
    else{
      return parseInt(propsc.info[propsc.info.length-1][0])+1;
    }
  }

  var newId = handleValue();

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
      setModalOpen(true);
      setDeleteID(id);
    }
    click(e,id);
  }

  const onSearch = async (value : string) =>{
    search(value);
  }

  const onSave = async (info : Array<string>) =>{
    const a = await save(info);
    if (a == true){
      setAdd(false);
    }
  }
  const onEdit = async (info : Array<string>) => {
    const a = await editF(info);
    console.log(a);
    if (a == true){
      setEdit(false);
    }
  }
  const closingAddEdit = () => {
    if (add == true){
      setAdd(false);
      setValuesOf(Array(importing.tableHeader.length-1).fill(""));
    }
    if (edit== true){
      setEdit(false);
      setValuesOf(Array(importing.tableHeader.length-1).fill(""));
    }
    setValuesOf(Array(importing.tableHeader.length-1).fill(""));
  }

  return (
    <main className="flex">
        <Sidebar role={role} />
        <div className="m-10 flex flex-col w-full">

        <DeleteModal isOpen={isOpen} texti={text} fun={deleteF} ID={deleteID} setModalOpen={setModalOpen}/>

        <TableHeader title={importing.title} placeholder={importing.search} 
        handleSearchClick={onSearch} setAdd={setAdd} name={importing.name}/>
        
        {add &&
        <Add role={role} ID={newId} valuesOf={valuesOf} placeholders={importing.placeholders} 
                ids={importing.ids} types={importing.types} save={onSave} handleClosing={closingAddEdit}/> 
        }
        
        {edit && <Add role={role} ID={editing} valuesOf={valuesOf} placeholders={importing.placeholders} 
        ids={importing.ids} types={importing.types} save={onEdit} handleClosing={closingAddEdit}/>
        }
                    
        <Table props={propsc} onClick={handleClick}/>
        </div>
    </main>
);
}


interface NoPermissionsPageProps {
  role: string,
}

const NoPermissionsPage = ({role} : NoPermissionsPageProps) => {
  return (
    <main className="flex">
        <Sidebar role={role} />
        <div className="m-10 flex flex-col w-full">

        <h1> No tienes permisos para acceder a esta página</h1>
        
        </div>
    </main>
);
}

interface LoadingPageProps {
  role: string,
}

const LoadingPage = ({role} : LoadingPageProps) => {
  return (
    <main className="flex">
        <Sidebar role={role} />
        <div className="m-10 flex flex-col w-full">

        <h1> ... </h1>
        
        </div>
    </main>
);
}



export default function Organizations() {
  const [tableInfo, setTableInfo] = useState<string[][]>([]);
  const [role, setRole] = useState("");
  const [cookies, setCookie] = useCookies(["access_token","id"]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (cookies.access_token) {
      try {
        const decoded = jwt.decode(cookies.access_token, {}) as JwtPayload;
        const role_c = decoded?.role_name || 'Rol no encontrado';
        setRole(role_c);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
    else{
      router.push("/");
    }

    /*if (cookies.access_token != undefined){
      fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/user/'+cookies.id,{
      method: "GET" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"}})
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data.role_name)
        setRole(data.role_name)

      }).catch(error => {
        console.error('error', error);
      })
    }
    else{
      router.push("/");
    }*/
    getOrganizationsData();
    
  }, []);

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
        const values = handleInfo(data);
        setTableInfo(values);
        setLoading(false);       
      }).catch(error => {
        console.error('error', error);
      })
    };

  const handleInfo = (data : any) : Array<Array<string>> => {
      var infoChanged = new Array();
      for (var val of data) {
        var newD = [val.id,val.name,val.country,val.estate,
          val.personResponsible,val.cellphone,val.email]
        infoChanged.push(newD)
      } 
      return infoChanged;
    }

  const handleClick = async (e: any,id: any) => {
    console.log(e)
  }

  const onSearch = async (value : string) => {
    //handle search after pressing button
    console.log(value);
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/organization?search='+value,{
      method: "GET" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"}})
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        const values = handleInfo(data);
        setTableInfo(values);
      }).catch(error => {
        console.error('error', error);
    })
    console.log(value);
  }

  const onSave = async (info : Array<string>) : Promise<boolean> =>{
    //handle saving organization

    // ["ID","Nombre","País","Estado","Responsable","Teléfono","Correo electrónico"]
    console.log(info);
    var result = false 
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
        if (data.error_code){
          result=false;
          return result;
        }
        else{
          result=true;
          return result;
        }
      });
    getOrganizationsData();
    console.log(tableInfo);
    return response;
  }
  const onEdit = async (info : Array<string>) : Promise<boolean> => {
    console.log(info)
    //handle edition
    const id = info[0]
    var result = false
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
        if (data.error_code){
          result=false;
          return result;
        }
        else{
          result=true;
          return result;
        }       
      });
      getOrganizationsData();
      return response;
  }
  const onDelete = async (x : any) : Promise<boolean> => {
    //handle edition
    var result=false;
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/organization/'+x,{
      method: "DELETE" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"} ,})
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data);
        if (data.error_code){
          result=false;
          return result;
        }
        else{
          result=true;
          return result;
        }          
      });
      getOrganizationsData();
      return result
  }

  const page = () => {
    console.log(role);
    console.log(role === 'admin')
    if (role === 'admin' || role === 'project_leader'){
      return(<TablePage information={settings.organization} data={tableInfo} buttons={[FaPen,FaTrash]}
        click = {handleClick} search={onSearch} save={onSave} editF={onEdit} deleteF={onDelete} role={role}/>)
    }
    else if (role === ''){
      return (<LoadingPage role={role}/>) 
    }
    else{
      return (<NoPermissionsPage role={role}/>)      
    }
  }

  return(
    <>
    {page()}
    </>
    );
}