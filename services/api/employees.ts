import axiosInstance from "@/lib/axiosInstance";

export type CreateEmployeeDto = {
  name: string;
  nik: string;
  rfid_code: string;
  position: string;
  department: string;
  email?: string;
  phone_number?: string;
  address?: string;
  salary?: string;
  hire_date?: string;
  imageFile?: File;
};

export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;

export async function getAllEmployees() {
  const { data } = await axiosInstance.get("/employees");
  return data;
}

export async function getEmployeeById(employeeId: number) {
  const { data } = await axiosInstance.get(`/employees/${employeeId}`);
  return data;
}

export async function createEmployee(
  payload: CreateEmployeeDto,
  imageFile?: File
) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  if (imageFile) formData.append("imageFile", imageFile);

  const { data } = await axiosInstance.post("/employees", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateEmployee(
  employeeId: number,
  payload: UpdateEmployeeDto,
  imageFile?: File
) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  if (imageFile) formData.append("imageFile", imageFile);

  const { data } = await axiosInstance.patch(
    `/employees/${employeeId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
}

export async function deleteEmployee(employeeId: number) {
  const { data } = await axiosInstance.delete(`/employees/${employeeId}`);
  return data;
}
