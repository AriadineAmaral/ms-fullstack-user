import { Box } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListarUsers from "./pages/listar-users";
import FormularioNovoUser from "./pages/formulario-novo-user";
import EditarUser from "./pages/editar-user";

export default function App() {
  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <Header title="Admin Usuários" />

      <Box component='main' sx={{flexGrow: 1, p: 2}}>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListarUsers />} />
          <Route path="/users/novo" element={<FormularioNovoUser />} />

       <Route
        path="/users/editar/:userId" element={<EditarUser />}/> 
        </Routes>
        </BrowserRouter>
      </Box>

      <Footer />
    </Box>
  )
}

 
