import { Route, Routes } from "react-router-dom"
import Welcome from "./pages/Welcome"
import Register from "./pages/user/Register"
import Login from "./pages/user/Login"
import Dashboard from "./pages/user/Dashboard"
import AddTicket from "./pages/user/AddTicket"


function App() {

  return (
   <>
   <Routes>
    <Route path="/" element={<Welcome/>}/>
    <Route path="/user-register" element={<Register/>}/>
    <Route path="/user-login" element={<Login/>}/>

    <Route path="/dashboard" element={<Dashboard/>}>
        <Route path="add-tickets" element={<AddTicket/>}/>
    </Route>
   </Routes>
   </>
  )
}

export default App
