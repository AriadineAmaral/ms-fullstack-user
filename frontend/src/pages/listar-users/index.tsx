/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { UserDTO } from "../../models/user";

import * as userService from "../../services/user-service";
import axios from "axios";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";

export default function ListarUsers() {
  const [user, setUser] = useState<UserDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.findAll();
        setUser(data);
      } catch (error: unknown) {
        let msg = "Erro ao carregar Usuários!";
        if (axios.isAxiosError(error) && error.response) {
          msg = error.response.data.error || msg;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(`Tem certeza que deseja exluir o Usuário ID: ${id}?`))
      try {
        await userService.deleteById(id);
        setUser(user.filter((user) => user.id !== id));
        setSuccess("Usuário excluído com sucesso");
        setTimeout(() => setSuccess(null), 3000);
      } catch (error: unknown) {
        let msg = "Erro ao excluir usuário";
        if (axios.isAxiosError(error) && error.response) {
          msg = error.response.data.error || msg;
        }
        setSuccess(null);
        setError(msg);
        setTimeout(() => setError(null), 4000);
      }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Categorias
        </Typography>

        <Button variant="contained">
          <Link
            to="/users/novo"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Novo
          </Link>
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        !error && (
          <Typography variant="body1">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>CPF</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.nome}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.cpf}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="editar"
                          component={Link}
                          to={`/users/editar/${user.id}`}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          aria-label="excluir"
                          onClick={() => handleDelete(user.id)}
                          sx={{ ml: 1 }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
        )
      )}
    </Box>
  );
}