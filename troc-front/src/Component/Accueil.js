import NavBar from "./NavBar";
import { isTokenValid } from '../Service/utils';
import { Navigate } from "react-router-dom";

export default function Accueil() {

   if (!isTokenValid()) {
      return <Navigate to="/sign-in" />;
   }

 return (
   <>
      <NavBar/>
      <>Accueil</>
   </>
 )
}