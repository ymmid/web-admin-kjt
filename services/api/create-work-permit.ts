import axiosInstance from "../../lib/axiosInstance";

export type ScopeKey = "surat_jalan" | "bast" | "invoice";

export interface CreateWorkPermitDto {
  scope_key: ScopeKey;
}

export interface NewNumberResponse {
  scope: ScopeKey;
  newNumber: number;
}

export type AllScopesResponse = Record<ScopeKey | string, number>;

export interface LastNumberResponse {
  scope: ScopeKey;
  last_number: number;
}

export interface UpdateLastNumberDto {
  last_number: number;
}

export interface UpdateNumberResponse {
  scope: ScopeKey;
  updatedNumber: number;
}

export interface DeleteScopeResponse {
  message: string;
}

export async function generateNewNumber(scopeKey: ScopeKey) {
  const payload: CreateWorkPermitDto = { scope_key: scopeKey };
  const { data } = await axiosInstance.post<NewNumberResponse>(
    "/work-permit",
    payload
  );
  return data;
}

export async function getAllScopes() {
  const { data } = await axiosInstance.get<AllScopesResponse>("/work-permit");
  return data;
}

export async function getLastNumberByScope(scopeKey: ScopeKey) {
  const { data } = await axiosInstance.get<LastNumberResponse>(
    `/work-permit/${scopeKey}`
  );
  return data;
}

export async function updateLastNumber(scopeKey: ScopeKey, lastNumber: number) {
  const payload: UpdateLastNumberDto = { last_number: lastNumber };
  const { data } = await axiosInstance.patch<UpdateNumberResponse>(
    `/work-permit/${scopeKey}`,
    payload
  );
  return data;
}

export async function deleteScope(scopeKey: ScopeKey) {
  const { data } = await axiosInstance.delete<DeleteScopeResponse>(
    `/work-permit/${scopeKey}`
  );
  return data;
}
