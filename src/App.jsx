import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Home } from "./home"
import { Dashboard } from "./dashboard"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },

])

export function App() {
 return (
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
 )
}

