import SignIn from "./Component/SignIn";
import SignUp from "./Component/SignUp";
import ItemList from "./Component/Items/item-list";
import AddItem from "./Component/Items/item-add";
import ItemDetail from "./Component/Items/item-detail";

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
        component: <ItemList/>
    },
    {
        name: "add item",
        route: "add-item",
        component: <AddItem/>
    },
    {
        name: "item detail",
        route: "item/:id",
        component: <ItemDetail/>
    }
];

export default routes;
