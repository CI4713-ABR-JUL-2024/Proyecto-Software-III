'use client';
import React from 'react'
import { useState} from 'react';
import { FaRegUser, FaPen, FaCircle} from "react-icons/fa";
import { IconType } from "react-icons";
import { useEffect } from 'react';

import Select from "react-dropdown-select";
import Dropdown from "../components/Dropdown";


interface ActionProps {
  props: Array<IconType>,
  id: any,
  onClick: any,
  message: string[],
}


const Actions = ({props, id, onClick, message} : ActionProps) => {
  const buttonProp = props;
  const idUser = id;
  const handleClick = onClick;
  return (
  <>
  <div>
  {props.map((B,j) =>
  <button onClick={() => handleClick(j,idUser)} key={"button"+j} style={{padding : "10px"}} title={message[j]}> <B/></button>
  )}
  </div>
  </>
  );
}

interface DateProp {
  id: number,
  pos : number,
  onClick: any,
}

const DateSelector = ({pos,id,onClick} : DateProp) => {
  const handleClick = onClick;
  const position = pos;
  const idUser = id;
  return(
  <>
  <input type="date" id="dateselected" name="dateselected" onChange={(date) => handleClick([pos,date.target.value],id)}
  placeholder="Select date"/>
  </>
  );
}

interface TextProp {
  id: number,
  value : any,
  pos : number,
  posrow : number,
  onClick: any,
}

const Text = ({value,pos,posrow,id,onClick} : TextProp) => {
  const handleClick = onClick;
  const position = pos;
  const idUser = id;
  const [cvalue,setValue] = useState(value);

  const call = (e : any) => {
    handleClick([pos,posrow,e.target.value],id); 
    setValue(e.target.value);
  }

  return(
  <>
  <input className="e-input" type="text" id="text" name="textselected" onChange={(e) => call(e)}
  placeholder="..." value={cvalue}/>
  </>
  );
}



interface propsInterface {
  header: Array<string>,
  info: Array<Array<any>>,
  buttons: Array<IconType>,
  buttons_message : Array<string>,
}


interface TableProps {
    props : propsInterface,
    onClick : any,
}

const Table = ({props, onClick} : TableProps) => {
  const tableProps = props;
  var persons = {};
  const [currentAmount, setCurrentAmount] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  var pageNumber = Math.ceil(props.info.length/currentAmount);

  useEffect(() => {
      console.log("props")
      console.log(props);
    });  
  const options = [
    {
      value: 1,
      label: '5'
    },
    {
      value: 2,
      label: '10'
    },
    {
      value: 3,
      label: '20'
    }
  ];
  

  const handlePages = (p: Array<Array<string>>) => {
    var counter = 0;
    var counterPage = 1;
    var get = [];
    for (let i = 0; i < p.length; i++) {
      if (counter < currentAmount) {
        get[i] = counterPage;
      }
      counter+=1
      if (counter==currentAmount){
        counterPage+=1;
        counter=0;
      }
    }
    return get;
  }
  var getPages = handlePages(props.info);
  const handleClick = (e: any,id: any) => {
    onClick(e,id);
  };
  const changeCurrent = (e: any) =>{
    const value = e.target.innerHTML;
    setCurrentPage(Number(value));
  }

  const setValues = (e: any) => {
    const l = e[0].label;
    if (l == "5"){
      setCurrentAmount(5);
    }
    if (l == "10"){
      setCurrentAmount(10);
    }
    if (l == "20"){
      setCurrentAmount(20);
    }
    
  }

  const getButtonsUsingForLoop = (start: number, num: number) => {
    const array = []

    for(var i = start; i <= num; i++){
      if (i <= 5){
        array.push(<button key={"button"+i+"number"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" style={{padding : "20px",marginTop : "2%", marginLeft:"2%"}} onClick={changeCurrent} value={i}>{i}</button>)
      }
      else{
        array.push(<button key={"button"+i+"number"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" style={{padding : "20px",marginTop : "2%",marginLeft:"2%"}} onClick={changeCurrent} value={i}>{i}</button>)
        i+=Math.ceil(num/start)
      }
    }

    return array
  }

  const directionalButton = (name: string) => {
    const array = [];
    if (currentPage > 1 && name=="PREV"){
      array.push(<button key={name} className="bg-white-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" style={{padding : "20px",marginTop : "2%" ,marginLeft:"2%"}} onClick={() => setCurrentPage(currentPage-1)}>{name}</button>)
    }
    if (currentPage < pageNumber && name=="NEXT"){
      array.push(<button key={name} className="bg-white-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" style={{padding : "20px",marginTop : "2%",marginLeft:"2%"}} onClick={() => setCurrentPage(currentPage+1)}>{name}</button>)
    }
    return array
  }

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 20,
    })
  }

  const pagination = () => {
    return 
  }

  const getButtons = (info : any, j : any) => {
    if (tableProps.header[0] != "matrix"){
      return (<td style={{width : "8%", paddingTop : "2%", border: "2px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}> <Actions props={tableProps.buttons} id={parseInt(info[0])} message={tableProps.buttons_message} onClick={handleClick}/> </td>)
      }
    else{
      return (<td style={{width : "8%", paddingTop : "2%", border: "2px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}> <Actions props={tableProps.buttons} id={j} message={tableProps.buttons_message} onClick={handleClick}/> </td>)
    }
  }

  return (
    <>
    <div className="items-center" >
    <table style={{padding : "15px", borderSpacing: "30px", border: "2px solid white", borderCollapse: "collapse"}}>
      <tbody key="tbody">
      <tr key="tr1">
      {tableProps.header.map((header,j) =>
      {
        if (tableProps.header[0][0] == "matrix" && j>0){
          if (j==1){
            return (<td key={j} style={{width : "8%", paddingTop : "2%",border: "2px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}>{header} </td>)
          }
          else{
            const types = ["tipo1","tipo2"]
            console.log(header)
            if (header[0]=="Prioridad"){
              return (<td key={j} style={{width : "8%", paddingTop : "2%",border: "2px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}>{header[0]} </td>)
            }
            if (tableProps.info[0][1].includes("input")){
              return (<td key={j} style={{width : "8%", paddingTop : "2%",border: "2px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}>{header[0]} <Dropdown key={"inputnew"+j} setValues={handleClick} j={[-1,j-1]} opt={types} current={header[1]}/>  </td>)
            }
            else{
              return (<td key={j} style={{width : "8%", paddingTop : "2%",border: "2px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}>{header[0]} {header[1]} </td>)
            }
          }      
        }
        if (tableProps.header[0] != "matrix"){
          return (<td key={j} style={{width : "8%", paddingTop : "2%",border: "2px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}>{header} </td>)
        }
      }
       
      )}
      </tr>

      {tableProps.info.map((info,j) =>{

        if (getPages[j] == currentPage){
          return (<tr key={"tr2"+j}>


          {info.map((value,i) => 

            
            { //console.log(value);
              //console.log(info);
              if (value != "date" && !value.toString().includes("input") && !value.includes("priority")){
                return (<td key={"info_"+i+"_"+j} style={{width : "8%", paddingTop : "2%", border: "1px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}> {value} </td>)
              }
              else if (value.includes("input") && !value.includes("inputpriority")){
                const val = value.split(/(\s+)/);
                return (<td key={"input_"+i+"_"+j} style={{width : "8%", paddingTop : "2%", border: "1px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}> <Text value={val[2]} pos={i} posrow={j} id={parseInt(info[0])} onClick={handleClick}/> </td>)
              }
              else if (value.includes("inputpriority")){
                const val = value.split(/(\s+)/);
                const types = [1,2,3,4,5]
                return (<td key={"inputpr_"+i+"_"+j} style={{width : "8%", paddingTop : "2%", border: "1px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}> <Dropdown key={"inputpriority"+j} setValues={handleClick} j={["priority",j]} opt={types} current={val[2]}/> </td>)
              }
              else if (value.includes("priority")){
                const val = value.split(/(\s+)/);
                const types = [1,2,3,4,5]
                return (<td key={"priority_"+i+"_"+j} style={{width : "8%", paddingTop : "2%", border: "1px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}> {val[2]} </td>)
              }
              else{
                return (<td key={"date_"+i+"_"+j} style={{width : "8%", paddingTop : "2%", border: "1px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}> <DateSelector pos={i} id={parseInt(info[0])} onClick={handleClick}/> </td>)
              }
            }
          )}

          {getButtons(info,j)}

          </tr>);
        }
        }
      )}
      
      </tbody>
      </table>



      {tableProps.header[0] != "matrix" && <div style={{ display: 'flex', paddingTop : "2%", paddingLeft : "5%"}}>

      {directionalButton("PREV")}

      {getButtonsUsingForLoop(currentPage,pageNumber)}

      {directionalButton("NEXT")}

      <Select
        style={{marginTop : "40px", marginLeft : "25%"}} options={options} onChange={(values) => setValues(values)} 
        placeholder = "5"
        values={[]}
      />
      </div>}

      </div>
      </>
  );
}

//EJEMPLOS DE COMO PASAR LOS PROPS, LOS MENSAJES DE CADA BOTON, CADA BOTON Y LOS HEADERS
//El header y la lista de listas info deben tener campos que coincidan para rellenar la tabla.
//Se pasa al componente una funcion para manejar los eventos de click.
//La funcion debe tener handleClick = (e,id) dos entradas
// e es el numero del boton (para saber a que boton se le dio de la lista introducida)
// id es el numero de posicion del usuario en la lista info (para saber a que usuario se le desea aplicar algun cambio)
// la funcion handleClick se crea en la pagina donde se use el componente, y al haber un evento, se reciben los valores
// del boton y del usuario
// Para tener un selector de fecha en la tabla, pasar el string date
//Al modificar este valor, se recibe en la funcion handleClick el e = [posDateSelector,dateSelected] id = fila de la tabla
const AA = () => {
  const tableProp = {
    header : ["Correo","Nombre","Apellido","Rol","Tipo de Usuario"] , 
    info : [["adelina@mail.co","Adelina","date","Admin","User"],["adelina@mail.co","Rosario","Figueira","Admin","User"]],
    buttons:[FaPen,FaCircle], 
    buttons_message:["Edit","Cancel"]}

  const handleClick = (e: any,id: any) => {
    //e number of button on list
    //id position of user in info list
    console.log(e);
    console.log(id);
    //rellenar con el manejo del click hecho dependiendo del boton y el usuario 
  };
  return (
    <main>
    <Table props={tableProp} onClick={handleClick}/>
    </main>
  );
}


export default Table;
