import axios from "axios";
import type { UserDTO, UserInputDTO } from "../models/user";
import { BASE_URL } from "../utils/system";

export async function findAll(): Promise<UserDTO[]> {
  const response = await axios.get(`${BASE_URL}/users`);
  return response.data;
}


export async function deleteById(id: number) {
  await axios.delete(`${BASE_URL}/users/${id}`);
}

export async function findById(id: number): Promise<UserDTO> {
  const response = await axios.get(`${BASE_URL}/users/${id}`);
  return response.data;
}

export async function update(user: UserDTO) {
  const response = await axios.put(
    `${BASE_URL}/users/${user.id}`,
    user
  );
  return response.data;
}

export async function save(user: UserInputDTO): Promise<void> {
  await axios.post(`${BASE_URL}/users`, user);
}