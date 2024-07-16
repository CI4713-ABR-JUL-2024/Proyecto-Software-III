import Select from "react-dropdown-select";
import { use, useState } from "react";


interface DropdownProps {
  j : any,
  setValues : any,
  opt : Array<any>,
  current : string,
}

const Dropdown = ({j,setValues,opt,current} : DropdownProps) => {
  //que el dropdown se llene con esto
  const createOptions = () => {
    var option : Array<any> = []
    var val = 1
    for (var i in opt){
      option.push({
        value : val,
        label : opt[i]
      })
      val+=1
    }
    return option
  }

  const options = createOptions()
  /*[
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
  ];*/
  const [selectedOption, setSelected] = useState(options[0]);

  const handleChange = (e : any) => {
    console.log(e)
    setSelected(e)
  }
  return (
      <Select
        values={[{value : 0, label : current}]}
        onChange={(values) => setValues(values[0].label,j)}
        options={options}
      />
  );
}

export default Dropdown;