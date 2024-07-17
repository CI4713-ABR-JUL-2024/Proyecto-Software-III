'use client';
import React from 'react'
import { useState} from 'react';
import { FaRegUser, FaPen, FaCircle} from "react-icons/fa";
import { IconType } from "react-icons";
import { useEffect } from 'react';

import Select from "react-dropdown-select";


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

  return (
    <>
    <div className="items-center" >
    <table style={{padding : "15px", borderSpacing: "30px", border: "2px solid white", borderCollapse: "collapse"}}>
      <tbody key="tbody">
      <tr key="tr1">
      {tableProps.header.map((header,j) =>
      
      <td key={j} style={{width : "8%", paddingTop : "2%",border: "2px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}>{header} </td>
      )}
      </tr>

      {tableProps.info.map((info,j) =>{
        
        if (getPages[j] == currentPage){
          return (<tr key={"tr2"+j}>


          {info.map((value,i) => 
            
            {if (value != "date"){
              return (<td key={"info_"+i+"_"+j} style={{width : "8%", paddingTop : "2%", border: "1px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}> {value} </td>)
            }
            else{
              return (<td key={"date_"+i+"_"+j} style={{width : "8%", paddingTop : "2%", border: "1px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}> <DateSelector pos={i} id={parseInt(info[0])} onClick={handleClick}/> </td>)
            }
            }
          )}
          <td style={{width : "8%", paddingTop : "2%", border: "2px solid white", borderCollapse: "collapse", paddingLeft : "2%", paddingBottom:"2%"}}> <Actions props={tableProps.buttons} id={parseInt(info[0])} message={tableProps.buttons_message} onClick={handleClick}/> </td>

          </tr>);
        }
        }
      )}
      
      </tbody>
      </table>

      <div style={{ display: 'flex', paddingTop : "2%", paddingLeft : "5%"}}>

      {directionalButton("PREV")}

      {getButtonsUsingForLoop(currentPage,pageNumber)}

      {directionalButton("NEXT")}

      <Select
        style={{marginTop : "40px", marginLeft : "25%"}} options={options} onChange={(values) => setValues(values)} 
        placeholder = "5"
        values={[]}
      />
      </div>

      </div>
      </>
  );
}


export default Table;