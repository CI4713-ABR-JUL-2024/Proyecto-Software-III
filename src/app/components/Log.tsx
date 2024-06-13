import { useCookies } from 'react-cookie';

export default async function GetLog(){
  /*
  const [cookies, setCookie] = useCookies(['access_token'	]);
  const response = await fetch(
    new URL(`api/log`, process.env.NEXT_PUBLIC_BASE_URL),
    {
      method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.access_token}`,
            'type': 'text'
          },
    }
  );
  
  console.log(response)
  */
  return(
    <div> Holis</div>
  )
}