import { api } from "@/lib/api"

interface GetMeResponse {
  username: string
  bio: string
  avatarUrl: string
}

// Get me
async function getMeRequest(): Promise<GetMeResponse> {
  const { data } = await api.get<GetMeResponse>("/users/me")
  return data
}

// Update profile
async function updateProfileRequest(payload: FormData): Promise<GetMeResponse> {
  const { data } = await api.patch<GetMeResponse>(
    "/users/me",
    payload,
    { headers: { "Content-Type": "multipart/form-data" } }
  )
  return data
}

export { getMeRequest, updateProfileRequest }
export type { GetMeResponse }
