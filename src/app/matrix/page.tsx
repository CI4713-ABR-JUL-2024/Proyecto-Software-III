'use client';
import { use, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from 'react-cookie';
import { FaRegUser, FaPen, FaCircle, FaTrash} from "react-icons/fa";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { PageTable } from "../components/PageWithTable";
const TablePage = PageTable.TablePage;
const LoadingPage = PageTable.LoadingPage;
const NoPermissionsPage = PageTable.NoPermissionsPage;
import { useSearchParams } from "next/navigation";

import settings from './settings.json';

export default function Matrix() {
  //const [tableInfo, setTableInfo] = 
  //const location = useLocation();
  //const queryParam = new URLSearchParams(location.search);
  //console.log(queryParam.get("type"))
  /////
  //falta lo de los parametros que se pasan por el url aqui y en la otra pagina de objectivedetails


  var iniciativas = ["matrix","Iniciativas / Resultados Clave",["Iniciativa 1","float"],["Iniciativa 2","float"],["Iniciativa 3","float"],["Iniciativa 4","float"]]
  
  const resultadosClave = ["Resultado 1","Resultado 2","Resultado 3","Resultado 4"]

  const [S, setS] = useState(settings.matrix);

  const createTable = (editing) => {
    var lista = [];
    for (var res in resultadosClave){
      var a = []
      if (editing){
        a = Array(iniciativas.length-2).fill("input 4")
      }
      else{
        a = Array(iniciativas.length-2).fill("4")
      }
      a.unshift(resultadosClave[res]);
      lista.push(a)      
    }
    console.log(lista)
    return lista
  }

  const [tableInfo, setTableInfo] = useState(createTable(false));

  const updateTable = (editing) => {
    console.log(S);
    const nextInfo = tableInfo.map((c, r) => {
      const x = c.map((p,c) => {
        if (p.includes("input") && editing == false){
          const val = p.split(/(\s+)/);
          return val[2];
        }
        else if (editing){
          return "input "+p;
        }
        else{
          return p
        }
      })
      return x
    });
    return nextInfo;
  }

  function updateInfo(value : string,row : number,col : number) {
    console.log(value)
    console.log(row)
    console.log(col)
    const nextInfo = tableInfo.map((c, r) => {
      const x = c.map((p,c) => {
        if (r === row && c === col){
          console.log("this is ")
          return "input "+value;
        }
        else{
          return p
        }
      })
      return x
    });
    console.log(nextInfo)
    setTableInfo(nextInfo);
    console.log(tableInfo)
  }

  
  //useState<string[][]>([]);
  const [role, setRole] = useState("");
  const [cookies, setCookie] = useCookies(["access_token","id"]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const searchParams = useSearchParams();
  let property1 = searchParams.get("name");
  let property2 = searchParams.get("id");

  console.log(property1);
  console.log(property2);


  useEffect(() => {
    settings.matrix.tableHeader = iniciativas;
    console.log(settings.matrix.tableHeader)
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
        console.log(values);
        //setTableInfo(values);
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

  function updateType (pos : number, value : any) {
    iniciativas[pos+1][1] = value
    var Z = S.tableHeader
    Z[pos+1][1] = value;
    console.log(iniciativas);
    var c = S
    c.tableHeader = Z;
    console.log(c);
    return c;
  }

  const handleClick = async (e: any,id: any) => {
    console.log(e)
    console.log(id)
    if (e == -1 && id=="back"){
      console.log("backtopage");
      const name = "objetivo"
      const id = "12"
      router.push(`/objective_details?name=${name}&id=${id}`);
    }
    if (e == "Guardar"){
      //se esta editando
      setTableInfo(updateTable(true))
    }
    else if (e == "Editar"){
      //se esta guardando
      console.log(S)
      setTableInfo(updateTable(false))

    }
    else{
      console.log(typeof id === Array);
      console.log(typeof id === Array<number>);
      console.log(typeof id);
      if (typeof id === 'object'){
        //header que id sea arreglo
        //headerTypes[id[1]] = e
        console.log("header")
        setS(updateType(id[1],e))
        console.log(S);
        
      }
      else{
        console.log("val of matrix")
        const col = e[0];
        const row = e[1];
        const value = e[2];
        updateInfo(value,row,col);
      }
    }
    console.log("HANDLING")
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
        //setTableInfo(values);
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
      return(<TablePage information={S} data={tableInfo} buttons={[]}
        click = {handleClick} search={onSearch} save={onSave} editF={onEdit} deleteF={onDelete} role={role} subtitle={""}/>)
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