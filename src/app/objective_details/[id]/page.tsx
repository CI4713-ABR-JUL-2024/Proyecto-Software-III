'use client';
import { use, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from 'react-cookie';
import { FaBorderNone, FaDiaspora, FaPen, FaTrash} from "react-icons/fa";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { PageTable } from "../../components/PageWithTable";

const TablePage = PageTable.TablePage;
const LoadingPage = PageTable.LoadingPage;
const NoPermissionsPage = PageTable.NoPermissionsPage;
import { useSearchParams } from "next/navigation";

import settings from '../info.json';

interface IniciativeProps {
  id: number,
  name: string,
}

export default function ObjectiveDetails({params} : {params : {id : string}}) {
  const [role, setRole] = useState("");
  const [cookies, setCookie] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [tableInfo, setTableInfo] = useState<Array<Array<string>>>([]);
  const [iniciatives, setIniciatives] = useState<Array<IniciativeProps>>([]);
  const [iniciative, setIniciative] = useState<IniciativeProps>();
  const [objetive, setObjetive] = useState<any>();
  const [listOfNames, setListOfNames] = useState<Array<string>>([]);

  const fetchKeyResult = async () => {
    try {
      console.log('params:', params.id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/keyResult/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Datos del keyResult:', data);
        setTableInfo(data.map((x: any) => [x.id, x.keyResult, x.keyIndicator, x.initiative, x.initiativeType_id]));
      } else {
        console.error('Error al obtener los datos del keyResult');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };


 


  const tableInfoDummy = [["1","40 art publicados","# articulos","organizar","tarea"],
    ["2","40 art publicados","# articulos","organizar","tarea"],
    ["3","40 art publicados","# articulos","organizar","tarea"]];

  //useState<string[][]>([]);
  const searchParams = useSearchParams();
  let property1 = searchParams.get("name");
  let property2 = searchParams.get("id");

  console.log(property1);
  console.log(property2);

  const subtitle = `Objetivo con el ID ${params.id}`;

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
    fetchKeyResult();
    
  }, []);


  const getIniciatives = async () => {
    console.log('Obteniendo las iniciativas')
    await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/initiativeType', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.access_token}`,
      },
    }).then((res) => res.json()
    ).then((data) => {
      console.log('Se obtuvieron las iniciativas')
      console.log(data);
      setIniciatives(data);
    });

    return true;
  }

  function matchIniciative(name: string, list:any) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].name == name) {
        setIniciative(list[i].id);
      }
    }
    return null;
  }

  function getNames(list: any) {
    const names = list.map((item: any) => item.name);
    return names;
  }


  const getDetail = async () => {
    console.log('Obteniendo detalle del objetivo', params.id)
    await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/objective/'+params.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.access_token}`,
      },
    }).then((res) => res.json()
    ).then((data) => {
      setObjetive(data);
      console.log('Se obtuvo el detalle del objetivo')
      console.log(data);
    });
    return true;
  }



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
    console.log(id)
    console.log("HANDLING")
    if (e == 0){
      router.push('/matrix/'+params.id);
      //router.push("/");
    } 
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

  useEffect(() => {
    if (cookies.access_token) { 
      getIniciatives();
    }
  }, [cookies.access_token]); 

  const onSave = async (info : Array<string>) : Promise<boolean> =>{
    //handle saving organization
    
    console.log("iniciativas:",iniciatives);
    getIniciatives();
    getNames(iniciatives);
    getDetail();
    matchIniciative(info[4], iniciatives);
    console.log(info); 

    const objetiveD = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/objectiveDetail',{
      method: "POST" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"} , // se pasa la contrasena encriptada
      body : JSON.stringify({"objective_id": objetive?.id}
      )}).then((res) => res.json()
    ).then((data) => {
      console.log('Se obtuvo el detalle del objetivo')
      console.log(data);
      return data;
    });

    const objectivedid = objetiveD.id;
    var result = false 
    const bodyContent = JSON.stringify({
      keyResult: info[1], 
      keyIndicator: info[2], 
      iniciative: info[3],
      iniciativeType: info[4], 
      iniciativeType_id: iniciative, 
      objetiveDetail: [objetive?.id]
    });

    console.log('bodyContent:', bodyContent);
    console.log('objectidetailid:', objectivedid);
    console.log(objetive);
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/keyResult',{
      method: "POST" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"} , // se pasa la contrasena encriptada
      body : JSON.stringify({keyResult: info[1], keyIndicator: info[2], initiative: info[3],
        initiativeType: info[4], initiativeType_id: iniciative, 
        objectiveDetail: [objectivedid]}
      )})
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
    console.log(tableInfo);
    return result;
  }
  const onEdit = async (info : Array<string>) : Promise<boolean> => {
    console.log("iNFORMACION DE EDICION",info)
    //handle edition
    const id = info[0]
    var result = false
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/keyResult/'+info[0],{
      method: "PUT" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"} , // se pasa la contrasena encriptada
      body : JSON.stringify({keyResult: info[1], keyIndicator: info[2], initiative: info[3], initiativeType_id: iniciative,}
      )})
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

      return result;
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
      return result
  }

  const page = () => {
    console.log(role);
    console.log(role === 'admin')
    console.log(role === 'project_leader')
    if (role === 'admin' || role === 'project_leader'){
      console.log(iniciatives)
      console.log('esto es una', iniciatives[0])
      //console.log('esto es nombre', iniciatives[0].name)
      console.log('lista de nombres:',listOfNames)
      return(<TablePage information={settings.organization} data={tableInfo} buttons={[FaBorderNone,FaPen,FaTrash]}
        click = {handleClick} search={onSearch} save={onSave} editF={onEdit} deleteF={onDelete} role={role} subtitle={subtitle} 
        iniciatives={getNames(iniciatives)}/>)
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