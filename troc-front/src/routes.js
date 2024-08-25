import SignIn from "./Component/SignIn";
import SignUp from "./Component/SignUp";
import ItemList from "./Component/Items/item-list";
import AddItem from "./Component/Items/item-add";
import ItemDetail from "./Component/Items/item-detail";
import MyItem from "./Component/Items/my-item";
import EditItem from "./Component/Items/item-edit";
import ExchangeList from "./Component/Exchanges/ExchangeList";

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
    },
    {
        name: "my item",
        route: "my-item",
        component: <MyItem/>
    },
    {
        name:"edit item",
        route:"edit-item/:itemId",
        component:<EditItem />
    },
    {
        name:"exchanges item",
        route:"exchanges/item/:itemId",
        component:<ExchangeList />
    }
];

export default routes;
