import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, BrowserRouter } from "react-router-dom";

import './index.css'
import Home from './Components/Home'
import ViewPost from './Components/ViewPost/ViewPost'
import PubForm from './Components/PubForm/PubForm'
import Profile from './Components/Profile'
import UserForm from "./Components/UserForm"
import FooterInfo from "./Components/FooterInfo"
import Posts from "./Components/Posts"
import ShowContent from './Components/ShowContent';
import {AuthProvider} from './Components/Context'


const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/post/:id/:idUser",
    element:<ViewPost/>
  },
  {
    path:"/pubform",
    element:<PubForm/>
  },
  {
    path:"/profile/:idUser",
    element:<Profile/>
  },
  {
    path:"/userform",
    element:<UserForm/>
  },
  {
    path:"/footerinfo",
    element:<FooterInfo/>
  },
  {
    path:"/posts",
    element:<Posts/>
  },
  {
    path:"/showcontent",
    element:<ShowContent/>
  },
  {
    path:"/showposts/:category/:fk_Tags/",
    element:<ShowContent/>
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
  </StrictMode>,
)
