import SignIn from "./Component/SignIn";
import SignUp from "./Component/SignUp";
import Accueil from "./Component/Accueil";

const routes = [
    {
        name: "sign up",
        route: "sign-up",
        component: <SignUp/>
    },
    {
        name: "sign in",
        route: "sign-in",
        component: <SignIn/>
    },
    {
        name: "accueil",
        route: "accueil",
        component: <Accueil/>
    }
];

export default routes;
