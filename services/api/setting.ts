import axiosInstance from "@/lib/axiosInstance";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}
export interface CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;

export async function createUser(userData: CreateUserDto): Promise<User> {
  const response = await axiosInstance.post("/users", userData);
  return response.data;
}

export async function getAllUsers(): Promise<User[]> {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getUserById(userId: number): Promise<User> {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
}

export async function updateUser(
  userId: number,
  updateData: UpdateUserDto
): Promise<User> {
  const response = await axiosInstance.patch(`/users/${userId}`, updateData);
  return response.data;
}

export async function deleteUser(userId: number): Promise<User> {
  const response = await axiosInstance.delete(`/users/${userId}`);
  return response.data;
}
