import { api } from "@/lib/api"
import type {
  GetBlockResponse,
  GetContactResponse,
  GetRequestResponse,
  RequestDirection,
  SendRequest,
} from "./types"

// CONTACT APIs
// Get contacts
async function getContacts(): Promise<GetContactResponse[]> {
  const { data } = await api.get<GetContactResponse[]>("/contacts")
  return data
}

// Get requests
async function getRequests(
  direction?: RequestDirection
): Promise<GetRequestResponse[]> {
  const { data } = await api.get<GetRequestResponse[]>("/requests", {
    params: { direction },
  })
  return data
}

// Find user
async function findUserRequest(email: string): Promise<GetContactResponse> {
  const { data } = await api.get<GetContactResponse>("/requests/find", {
    params: { email },
  })
  return data
}

// Add friend
async function addFriend(payload: SendRequest): Promise<string> {
  const { data } = await api.post<string>("/requests", payload)
  return data
}

// Accept
async function acceptRequest(requestId: string): Promise<void> {
  await api.post<void>(`/requests/${requestId}/accept`)
}

// Reject
async function rejectRequest(requestId: string): Promise<void> {
  await api.post<void>(`/requests/${requestId}/reject`)
}

// Restore
async function restoreRequest(requestId: string): Promise<void> {
  await api.delete<void>(`/requests/${requestId}`)
}

// Delete contact
async function deleteContact(contactId: string): Promise<void> {
  await api.delete<void>(`/contacts/${contactId}`)
}

// Get blocked
async function getBlocked(): Promise<GetBlockResponse[]> {
  const { data } = await api.get<GetBlockResponse[]>("/blocks")
  return data
}

// Block user
async function blockContact(blockedId: string): Promise<void> {
  await api.post<void>(`/blocks/${blockedId}`)
}

// Unblock user
async function unblockContact(blockedId: string): Promise<void> {
  await api.delete<void>(`/blocks/${blockedId}`)
}

// CHAT API

export {
  getContacts,
  getRequests,
  findUserRequest,
  addFriend,
  acceptRequest,
  restoreRequest,
  rejectRequest,
  deleteContact,
  getBlocked,
  blockContact,
  unblockContact,
}
