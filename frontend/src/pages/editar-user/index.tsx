/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UserDTO } from "../../models/user";
import { findById, update } from "../../services/user-service";
import axios from "axios";

type FormData = {
  nome: string;
  email: string;
  cpf: string;
};

export default function EditarUser() {
  const { userId } = useParams();

  const [user, setUser] = useState<UserDTO>();

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({ nome: "", email: "", cpf: "" });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategoriaData() {
      if (userId) {
        try {
          const data = await findById(Number(userId));
          setUser(data);
          setFormData({ nome: data.nome, email: data.email, cpf: data.cpf });
        } catch (error: unknown) {
          let msg = "Erro ao excluir usuário";
          if (axios.isAxiosError(error) && error.response) {
            msg = error.response.data.error || msg;
          }
          setError(msg);
          setTimeout(() => setError(null), 4000);
          navigate("/");
        }
      }
    }
    fetchCategoriaData();
  }, [userId, navigate]);

  function handleFormChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const requestBody = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
      } as UserDTO;

      if (userId) {
        requestBody.id = Number(userId);
      }

      await update(requestBody);
      setSuccess("Usuário atualizada com sucesso.");
      setTimeout(() => navigate("/"), 3000);
    } catch (error: unknown) {
      let msg = "Erro ao carregar usuários.";

      if (axios.isAxiosError(error) && error.response && error.response.data) {
        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const errorMessages = error.response.data.errors
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((e: any) => e.message)
            .join(", ");
          msg = `Dados inválidos: ${errorMessages}. Tente novamente.`;
        } else {
          msg = error.response.data.error || msg;
        }
      }
      setError(msg);
      setTimeout(() => setError(null), 3000);
    }
  }

  return (
    <Box sx={{ mt: 2, p: 4 }}>
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

      <Typography variant="h4" component="h1">
        Editar Categoria
      </Typography>

      <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleSubmit}>
        <TextField
          id="nome"
          name="nome"
          label="Nome do Usuário"
          value={formData.nome}
          onChange={handleFormChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          id="email"
          name="email"
          label="Email do Usuário"
          value={formData.email}
          onChange={handleFormChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          id="cpf"
          name="cpf"
          label="CPF do Usuário"
          value={formData.cpf}
          onChange={handleFormChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/categorias")}
          >
            Cancelar
          </Button>
          <Button variant="outlined" color="primary" type="submit">
            Salvar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}