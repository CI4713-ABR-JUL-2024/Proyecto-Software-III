import Logger from "../components/Logger";
import Sidebar from "../components/Sidebar";
const Loger = () => {
  return(
    <main className="flex">
      <Sidebar role ="admin"/>
      <div>
      <Logger />
      </div>
    </main>
  )
}

export default Loger;