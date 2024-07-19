'use client';
import { use, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from 'react-cookie';
import { FaRegUser, FaPen, FaCircle, FaTrash} from "react-icons/fa";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { PageTable } from "../../components/PageWithTable";
const TablePage = PageTable.TablePage;
const LoadingPage = PageTable.LoadingPage;
const NoPermissionsPage = PageTable.NoPermissionsPage;
import { useSearchParams } from "next/navigation";

import settings from '../info.json';

function zip(arr1: any[], arr2: any[]) {
  return arr1.map((k, i) => [k, arr2[i]]);
}



export default function Matrix({params} : {params : {id : string}}) {
  
  const resultadosClave = ["Resultado 1","Resultado 2","Resultado 3","Resultado 4"]

  const [iniciatives, setIniciatives] = useState<string[]>(["Iniciativa 1","Iniciativa 2","Iniciativa 3","Iniciativa 4"]);
  const [results, setResults] = useState<string[]>(["Resultado 1","Resultado 2","Resultado 3","Resultado 4"]);
  const [resultsTypes, setResultsTypes] = useState<any[][]>([["matrix"],["Iniciativas / Resultados Clave"],["Resultado 1","float"],["Resultado 2","float"],["Resultado 3","float"],["Resultado 4","float"],["Prioridad"]]);

  const [S, setS] = useState(settings.matrix);
  const [matrix, setMatrix] = useState<{ [key: string]: any }>({ });

  const fetchMatrix = async () => {
    try {
      console.log('params:', params.id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matrix/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setMatrix(data);
      } else {
        console.error('Error al obtener los datos de la matrix');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const createIniciative = (i : Array<string>, t : Array<string>) : Array<Array<string>> => {
    var iniciativa = [["matrix"],["Iniciativas / Resultados Clave"]]
    for (var x in i){
      const arreglo = [i[x],t[x]];
      iniciativa.push(arreglo);
    }
    return iniciativa
  }

  useEffect(() => {
    fetchMatrix();
  }, []);
  


  //Como inicializar la tabla
  //En resultadosClave son una lista de los resultados (los valores de cada fila)
  //en las iniciativas introducir los valores de las columnas y los tipos (con la funcion anterior luego de llamar al endpoint)
  //crear iniciativas luego de llamar al endpoint y antes de generar la tabla
  //luego al crear la tabla llamar a crearTable y modificar la funcion para que se llene con los valores del back


  const createTable2 = (editing : any) => {
    var lista = [];
    for (var i of iniciatives){
      const ini = matrix ? matrix[i] : null;
      var a = []
      if (editing){
        // a = Array(iniciativas.length-3).fill("input 4")
      }
      else{
        // resultTypes pero sin los dos primeros elementos
        for (var res of results){
          a.push(ini? ini[res].toString(): '4');
        }
      }
      console.log('a', a);
      a.unshift(i);
      a.push(`priority ${ini ? matrix[i]['prioridad'] : '0'}`);
      lista.push(a)      
    }
    //lista.push(["priority 1"])
    //(lista)
    return lista
  }
  const [tableInfo, setTableInfo] = useState(createTable2(false));

    useEffect(() => {
    if (matrix && matrix['tipos']) {
      console.log('Imprimiendo matrix', matrix);
      const inicitivas = Object.keys(matrix).filter((key) => key !== 'tipos');
      const tipos = Object.values(matrix['tipos']);
      console.log('Imprimiendo iniciativas', inicitivas);
      console.log('Imprimiendo matriz de resultados', matrix[inicitivas[0]]);
      const resultss = Object.keys(matrix[inicitivas[0]]).filter((key) => key !== 'prioridad');
      setIniciatives(inicitivas);

      console.log('Imprimiendo tipos', tipos);
      console.log('Imprimiendo resultados', results);
      setResults(resultss);
      const resultTypess = zip(resultss, tipos);
      resultTypess.unshift(["Iniciativas / Resultados Clave"]);
      resultTypess.unshift(["matrix"]);
      resultTypess.push(["Prioridad"]);
      setResultsTypes(resultTypess);
      console.log('Imprimiendo tipos de resultados', resultTypess);
      const table = createTable2(false);
      if (table.length > 0){
        setTableInfo(table);
      }
      
      
    }
  }, [matrix]);

  const updateTable = (editing : any) => {
    //(S);
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

  useEffect(() => {
    console.log('Imprimiendo tableInfo',tableInfo);
  }, [tableInfo]);

  const updateRow = (editing : any, row : number) => {
    //(tableInfo);
    const nextInfo = tableInfo.map((c, r) => {
      //(r==row)
      const x = c.map((p,s) => {
        if (p.includes("input") && !p.includes("inputpriority") && editing == false && r == row){
          const val = p.split(/(\s+)/);
          return val[2];
        }
        else if (p.includes("inputpriority") && editing == false && r == row){
          const val = p.split(/(\s+)/);
          return "priority "+val[2];
        }
        else if (p.includes("inputpriority") && editing == true && r == row){
          return p;
        }
        else if (p.includes("priority") && !p.includes("inputpriority") && editing == false && r == row){
          return p;
        }
        else if (p.includes("priority") && !p.includes("inputpriority") && editing == true && r == row){
          return "input"+p;
        }
        else if (editing && r==row && s>0){
          return "input "+p;
        }
        else{
          return p
        }
      })
      return x
    });
    //(nextInfo);
    return nextInfo;
  }


  function updateInfo(value : string,row : number,col : number) {
    //(value)
    //(row)
    //(col)
    const nextInfo = tableInfo.map((c, r) => {
      const x = c.map((p,c) => {
        if (r === row && c === col){
          //("this is ")
          return "input "+value;
        }
        else{
          return p
        }
      })
      return x
    });
    //(nextInfo)
    setTableInfo(nextInfo);
    //(tableInfo)
  }

  
  //useState<string[][]>([]);
  const [role, setRole] = useState("");
  const [cookies, setCookie] = useCookies(["access_token","id"]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const searchParams = useSearchParams();
  let property1 = searchParams.get("name");
  let property2 = searchParams.get("id");
  //PASAR AQUI LOS PARAMETROS DE CONSOLA ANTES DE LLAMAR AL ENDPOINT Y ENTRAR PARA SABER QUE MATRIZ SE ABRIO

  //(property1);
  //(property2);


  useEffect(() => {
    settings.matrix.tableHeader = resultsTypes;
    //(settings.matrix.tableHeader);
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
    
  }, [resultsTypes]);

  const getOrganizationsData = async () => {
     const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/organization',{
      method: "GET" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"}})
      .then(res => {
        return res.json();
      })
      .then(data => {
        //(data);
        const values = handleInfo(data);
        //(values);
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
    //modificar esto porque los tipos no coinciden
    //iniciativas[pos+1][1] = value

    var Z = S.tableHeader

    if (typeof value === 'string'){
      Z[pos+1][1] = value;
    }

    //Z[pos+1][1] = value;
    //(iniciativas);
    var c = S
    console.log('c',c);
    console.log('Z',Z);
    c.tableHeader = Z;
    //(c);
    return c;
  }

  const changePriority = (row : any, value : any) => {
    const nextInfo = tableInfo.map((c, r) => {
      const x = c.map((p,s) => {
        if (p.includes("inputpriority") && r==row){
          const val = p.split(/(\s+)/);
          return "inputpriority "+value;
        }
        else{
          return p
        }
      })
      return x
    });
    return nextInfo;
  }

  const handleClick = async (e: any,id: any) => {
    //(e)
    //(id)
    if (typeof id === 'object'){
      if (id[0]=="priority"){
        setTableInfo(changePriority(id[1],e));
      }
    }
    if (typeof e === 'number' && typeof id === 'number'){
      if (e == 0){
        setTableInfo(updateRow(true,id));
        //(tableInfo);
      }
      else{
        setTableInfo(updateRow(false,id));
      }
    }
    else{
      if (e == -1 && id=="back"){
        //("backtopage");
        const name = "objetivo"
        const id = "12"
        router.push(`/objective_details/${params.id}`);
      }
      if (e == "Guardar"){
        //se esta editando
        setTableInfo(updateTable(true))
      }
      else if (e == "Editar"){
        //se esta guardando
        //(S)
        setTableInfo(updateTable(false))

      }
      else{
        if (typeof id === 'object'){
          //header que id sea arreglo
          //headerTypes[id[1]] = e
          //("header")
          setS(updateType(id[1],e))
          //(S);
          
        }
        else{
          //("val of matrix")
          const col = e[0];
          const row = e[1];
          const value = e[2];
          updateInfo(value,row,col);
        }
      }
    }
    //("HANDLING")
  }

  const onSearch = async (value : string) => {
    //handle search after pressing button
    //(value);
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/organization?search='+value,{
      method: "GET" , headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"}})
      .then(res => {
        return res.json();
      })
      .then(data => {
        //(data);
        const values = handleInfo(data);
        //setTableInfo(values);
      }).catch(error => {
        console.error('error', error);
    })
    //(value);
  }

  const onSave = async (info : Array<string>) : Promise<boolean> =>{
    //handle saving organization

    // ["ID","Nombre","País","Estado","Responsable","Teléfono","Correo electrónico"]
    //(info);
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
        //(data);
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
    //(tableInfo);
    return response;
  }
  const onEdit = async (info : Array<string>) : Promise<boolean> => {
    //(info)
    //handle edition
    const id = info[0]
    var result = false
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/matrix/'+params.id,{
      method: "GET" , 
      headers : {
                "Authorization": "Bearer "+cookies.access_token,
                "type" : "text"} ,})
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        //(data);
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
        //(data);
        //(data);
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
    //(role);
    //(role === 'admin')
    if (role === 'admin' || role === 'project_leader'){
      return(<TablePage information={S} data={tableInfo} buttons={[FaPen,FaCircle]}
        click = {handleClick} search={onSearch} save={onSave} editF={onEdit} deleteF={onDelete} role={role} subtitle={""} iniciatives={[]}/>)
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