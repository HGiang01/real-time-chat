import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  acceptRequest,
  addFriend,
  blockContact,
  deleteContact,
  findUserRequest,
  getBlocked,
  getContacts,
  getRequests,
  rejectRequest,
  restoreRequest,
  unblockContact,
} from "../api"
import type { ApiError } from "@/lib/api"
import type {
  GetBlockResponse,
  GetContactResponse,
  GetRequestResponse,
  RequestDirection,
  SendRequest,
} from "@/features/chat/types.ts"

function useGetContacts() {
  return useQuery<GetContactResponse[], ApiError>({
    queryKey: ["contacts"],
    queryFn: getContacts,
  })
}

function useGetRequests(direction: RequestDirection) {
  return useQuery<GetRequestResponse[], ApiError>({
    queryKey: ["requests", direction],
    queryFn: () => getRequests(direction),
  })
}

function useFindUser(email: string) {
  return useQuery<GetContactResponse, ApiError>({
    queryKey: ["users", "find", email],
    queryFn: () => findUserRequest(email),
    enabled: !!email,
    retry: false,
  })
}

function useAddFriend() {
  const queryClient = useQueryClient()

  return useMutation<string, ApiError, SendRequest>({
    mutationFn: addFriend,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["requests", "outgoing"],
      })
    },
  })
}

function useRestoreRequest() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: restoreRequest,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["requests", "outgoing"],
      })
    },
  })
}

function useAcceptRequest() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: acceptRequest,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["requests", "incoming"],
      })
    },
  })
}

function useRejectRequest() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: rejectRequest,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["requests", "incoming"],
      })
    },
  })
}

function useRemoveContact() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: deleteContact,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["contacts"] })
    },
  })
}

function useGetBlocked() {
  return useQuery<GetBlockResponse[], ApiError>({
    queryKey: ["blocked"],
    queryFn: getBlocked,
  })
}

function useBlockContact() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: blockContact,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["blocked"] })
    },
  })
}

function useUnblockContact() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: unblockContact,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["blocked"] })
    },
  })
}

export {
  useGetContacts,
  useGetRequests,
  useFindUser,
  useAddFriend,
  useRestoreRequest,
  useAcceptRequest,
  useRejectRequest,
  useRemoveContact,
  useGetBlocked,
  useBlockContact,
  useUnblockContact,
}
