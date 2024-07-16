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
import jwt, { JwtPayload } from 'jsonwebtoken';

import settings from './info.json';

import { PageTable } from "../components/PageWithTable";
const TablePage = PageTable.TablePage;
const LoadingPage = PageTable.LoadingPage;
const NoPermissionsPage = PageTable.NoPermissionsPage;

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
    info.shift();
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
