import { Route, Routes } from "react-router-dom"
import Welcome from "./pages/Welcome"
import Register from "./pages/user/Register"
import Login from "./pages/user/Login"
import Dashboard from "./pages/user/Dashboard"
import AddTicket from "./pages/user/AddTicket"
import MyTickets from "./pages/user/MyTickets"
import TicketDetails from "./pages/user/TicketDetails"


function App() {

  return (
   <>
   <Routes>
    <Route path="/" element={<Welcome/>}/>
    <Route path="/user-register" element={<Register/>}/>
    <Route path="/user-login" element={<Login/>}/>

    <Route path="/dashboard" element={<Dashboard/>}>
        <Route path="/dashboard/add-tickets" element={<AddTicket/>}/>
        <Route path="/dashboard/my-tickets" element={<MyTickets/>}/>
<Route path="tickets/:id" element={<TicketDetails />} />
    </Route>
   </Routes>
   </>
  )
}

export default App
