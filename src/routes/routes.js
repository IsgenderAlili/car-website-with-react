import Home from "../pages/Home";
import MainLayout from "../pages/Layout";
import { Login } from "../components/Form/Login";
import { Register } from "../components/Form/Register";
import User from "../components/User/User";
import  Profile from "../components/User/Profile";
import Advertisements from "../components/User/Advertisements";
import NewAnnouncement from "../pages/NewAnnouncement"
import Favourites from "../pages/Favourites"
import PostDetail from "../pages/PostDetail";
import UpdatePostPage from "../pages/UpdatePostPage"
const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {path:"/user",
      element: <User />,
      children:[
        {
          path:"profile",
          element: <Profile />,
        },
        {
          path:"advertisements",
          element: <Advertisements />,
        }
      ]
    }
    ,{
      path:"/newannouncement",
      element: <NewAnnouncement />,
    },
    {
      path:"/updatepostpage",
      element: <UpdatePostPage />,
    },
    {
      path:"/favourites",
      element: <Favourites />,
    },
    {
      path:"/postdetail",
      element: <PostDetail/>,
    },
    ],
  },
];

export default routes;
