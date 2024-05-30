import React from "react";
import { useRouter } from "next/navigation";

export default function SuccessModal(props: { title:string, message: string }) {

  const [showModal, setShowModal] = React.useState(true);
  const router = useRouter();

  async function redirectProfile(){
    router.push("/profile");
  }
  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t flex-col ">
                  <svg className="h-20 w-20 text-green-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="12" cy="12" r="9" />  <path d="M9 12l2 2l4 -4" /></svg>
                  <h3 className="text-3xl font-semibold p-2"> 
                    {props.title}
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex justify-center items-center">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed text-xl ">
                    {props.message}
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-[#3A4FCC] background-transparent font-bold uppercase px-6 py-2 text-base outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      redirectProfile();
                    }}
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}