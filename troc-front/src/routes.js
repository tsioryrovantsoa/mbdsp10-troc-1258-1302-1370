import SignIn from "./Component/SignIn";
import SignUp from "./Component/SignUp";

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
    }
];

export default routes;
