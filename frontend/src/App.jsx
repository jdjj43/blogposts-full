import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import ErrorPage from "./error-page";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Root } from "./components/Root";
import { CreatePost } from "./components/CreatePost";
import { Login } from "./components/Login";
import { Posts } from "./components/Posts";
import { Post } from "./components/Post";
import { Register } from "./components/Register";
import { UserPosts } from "./components/UserPosts";
import './components/App.css';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [errors, setErrors] = useState([]);
  axios.defaults.withCredentials = true;

  // DONE: MAnejar si no hay post encontrado
  // DONE: hacer que post aparezca cuando se crea un nuevo post, que se actualice el estado pls, también con delete pls pls thx(poner en App el useState de fetchAllPost y enviarlo a los hijos )
  // DONE: Registro de usuario

  // DONE: Manejar edición de comentarios
  
  // TODO: Manejar errores para que aparezcan el página principal
  
  // DONE: Manejar los post de cada usuario
  
  // TODO: pasar cosas a useContext
  
  // TODO: useEffect que compruebe la duración de los tokens y user y cierre sesión si ya pasó el tiempo!!
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root loggedIn={loggedIn} setLoggedIn={setLoggedIn} userData={userData} setUserData={setUserData}></Root>,
      errorElement: <ErrorPage></ErrorPage>,
      children: [
        {
          path: "/",
          element: <Posts posts={posts} setPosts={setPosts} userData={userData}></Posts>
        },
        {
          path: "login/",
          element: <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUserData={setUserData}/>,
        },
        {
          path: "post/create/",
          element: <CreatePost posts={posts} setPosts={setPosts} userData={userData} />,
        },
        {
          path: "post/:id",
          element: <Post posts={posts} setPosts={setPosts} userData={userData} loggedIn={loggedIn} />
        },
        {
          path: "register/",
          element: <Register loggedIn={loggedIn}/>
        },
        {
          path: "user/posts",
          element: <UserPosts />
        }
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
