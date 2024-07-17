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
import Select from "react-dropdown-select";
import Dropdown from "../components/Dropdown";


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

  function handleEdition(value : string,index : number) {
    console.log(value)
    console.log(index)
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
    console.log(info)
    var val = 0
    if (newid == -1){
      val = 1
    }
    else{
      val = 0
    }
    for (let i = val; i < info.length; i++) {
      console.log (info[i]);
      if (info[i] == ""){
        return false;
      }
    }
    return true;
  }

  function idFound(){
    console.log(newid);
    if (newid != -1){
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
      /*if (B == "Tipo de Iniciativa"){
        //si esto existe hacer un get de las iniciativas que existen y pasarlas al dropdown
        const iniciativas = ["iniciativa1"]
        found.push(
        <div key={"inputdiv"+j}>
        <Dropdown key={"inputnew"+j} current={iniciativas[0]} setValues={handleEdition} j={j+1} opt={iniciativas}/> 
        </div>
        )
      }
      else {*/
      console.log(B)
      console.log(j)
      found.push(
      <div key={"inputdiv"+j}>
      <input 
          key={"inputnew"+j}
          id={id[j+1]+j}
          type={type[j+1]}
          value={info[j+1]}
          placeholder={B}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2.5" 
          onChange={(e) => { handleEdition(e.target.value,j+1) }}
          required
      />
      </div>
      )
    //}
      
    })
    return found;
  }

  return (
  <>
    <div className="flex flex-wrap p-5 bg-gray-300">
        
        {idFound()}
        
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
  subtitle : string,
}

const TableHeader = ({title,placeholder,handleSearchClick,setAdd,name,subtitle}:TableHeaderProps) => {
  const [searchVal, setSearchVal] = useState("");
  return (
  <>
  <div className="flex justify-between w-full p-4">
      <h3 className="text-2xl font-bold text-[#3A4FCC]">{title}</h3>
      {name == "Crear KR, KPI e Iniciativas" &&
        <h4 className="text-2xl font-bold text-[#3A4FCC]"> {subtitle} </h4>
        }
      { name != "matrix" &&
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
      }
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
  subtitle : string,
}

const TablePage = ({information,data,role,buttons,click,search,save,editF,deleteF,subtitle}:TablePageProps) => {
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editing, setEditing] = useState<string[] | null>(null);
  const importing = information
  const [valuesOf, setValuesOf] = useState(Array(importing.tableHeader.length).fill(""));
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

  var newId = -1; //handleValue();
  var editingMatrix = "Editar";
  const [e,setE] = useState("Editar");

  const handleClick = async (e: any,id: any) => {
    //when the buttons inside the table are clicked
    console.log(e)
    console.log(id)
    if (importing.name == "matrix" && id==-1){
      
      if (e == "Editar"){
        editingMatrix = "Guardar";
        setE("Guardar");
      }
      else{
        editingMatrix = "Editar";
        setE("Editar");
      }
      e = editingMatrix;
    }

    if (importing.name == "matrix" && importing.buttons_message[e] == "Edit"){
      
      console.log("EDITING THE LINE OF THE MATRIX");
      console.log(e)
      console.log(id)
    }

    if (importing.buttons_message[e] == "Edit" && importing.name != "matrix"){
      setEdit(true);
      setEditing(id);
      console.log(propsc.info)
      const id_n = parseInt(id)
      var found : Array<any> = [];
      for (var x in propsc.info){
        console.log(x);
        if (propsc.info[x][0] == id){
          found=propsc.info[x];
          console.log(propsc.info[x])
          break;
        }
      }
      console.log(found)
      //console.log(propsc.info[id_n]);
      setValuesOf(found);
      console.log(valuesOf)
    }
    if (importing.buttons_message[e] == "Delete" && importing.name != "matrix"){
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
      setValuesOf(Array(importing.tableHeader.length).fill(""));
    }
  }
  const onEdit = async (info : Array<string>) => {
    const a = await editF(info);
    console.log(a);
    if (a == true){
      setEdit(false);
      newId = -1
      setValuesOf(Array(importing.tableHeader.length).fill(""));
    }
  }
  const closingAddEdit = () => {
    if (add == true){
      setAdd(false);
      setValuesOf(Array(importing.tableHeader.length).fill(""));
    }
    if (edit== true){
      setEdit(false);
      setValuesOf(Array(importing.tableHeader.length).fill(""));
      newId = -1
    }
    setValuesOf(Array(importing.tableHeader.length).fill(""));
  }

  return (
    <main className="flex">
        <Sidebar role={role} />
        <div className="m-10 flex flex-col w-full">

        <DeleteModal isOpen={isOpen} texti={text} fun={deleteF} ID={deleteID} setModalOpen={setModalOpen}
         title={"Titulo"} text_success={"Se eliminó con éxito"} text_failed={"Falló la eliminación"}/>

        <TableHeader title={importing.title} placeholder={importing.search} 
        handleSearchClick={onSearch} setAdd={setAdd} name={importing.name} subtitle={subtitle}/>

        {importing.name == "matrix" && 
            <button onClick={(p) => handleClick(-1,"back")}
              className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full"> Volver a los detalles</button>
        }
        
        {add &&
        <Add role={role} ID={newId} valuesOf={valuesOf} placeholders={importing.placeholders} 
                ids={importing.ids} types={importing.types} save={onSave} handleClosing={closingAddEdit}/> 
        }
        
        {edit && <Add role={role} ID={editing} valuesOf={valuesOf} placeholders={importing.placeholders} 
        ids={importing.ids} types={importing.types} save={onEdit} handleClosing={closingAddEdit}/>
        }
                    
        <Table props={propsc} onClick={handleClick}/>

        {importing.name == "matrix NO PASA ELIMINAR" && 
            <button onClick={(p) => handleClick(e,-1)}
              className="ml-5 bg-[#3A4FCC] text-white font-bold py-2 px-4 rounded-full">{e}</button>
        }
        

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


export const PageTable = {
  LoadingPage,
  NoPermissionsPage,
  TablePage
}