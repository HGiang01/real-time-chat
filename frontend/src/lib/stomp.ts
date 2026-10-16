import { Client } from "@stomp/stompjs"

const client = new Client({
  brokerURL: import.meta.env.VITE_API_SOCKET_URL,
  heartbeatOutgoing: 10000, // cx
  heartbeatIncoming: 10000, // cy
  reconnectDelay: 10000,
  beforeConnect: (client) => {
    client.connectHeaders = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    }
  },
})

export { client }
