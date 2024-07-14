import WebSocket, { WebSocketServer } from "ws";
import {
  ADD_USER,
  PING,
  PING_ALL,
  PING_RECIEVED,
  REMOVE_USER,
} from "../utils/messages";
import { IncomingMessage, Server, ServerResponse } from "http";

export class SocketManager {
  private static _instance: SocketManager;
  private _io: WebSocketServer;
  private users: Map<string, WebSocket>;

  private constructor(
    server: Server<typeof IncomingMessage, typeof ServerResponse>
  ) {
    this._io = new WebSocketServer({ server });
    this.users = new Map<string, WebSocket>();
    this.initListener();
  }

  public static getInstance(
    server: Server<typeof IncomingMessage, typeof ServerResponse>
  ) {
    this._instance = new SocketManager(server);
  }

  initListener() {
    const wss = this._io;

    wss.on("connection", (ws) => {
      ws.on("error", console.error);

      console.log("connection established!");

      ws.on("message", (data) => {
        const message = JSON.parse(data.toString());

        if (message.type === ADD_USER) {
          this.users.set(message.payload.id, ws);
          console.log(this.users.size);
        }

        if (message.type === REMOVE_USER) {
          this.users.delete(message.payload.id);
          console.log("user deleted");
        }

        if (message.type === PING) {
          const toUser = message.payload.to;
          const fromUser = message.payload.from;
          const toSocket = this.users.get(toUser.id);
          const fromSocket = this.users.get(fromUser.id);

          if (!toSocket) {
            console.log("recivers socket not found");
            return;
          }
          if (!fromSocket) {
            console.log("sender's socket not found");
            return;
          }

          toSocket.send(
            JSON.stringify({
              type: PING_RECIEVED,
              payload: {
                from: fromUser,
              },
            })
          );
        }

        if (message.type === PING_ALL) {
          const fromUser = message.payload.from.name
          wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: PING_RECIEVED,
                payload :{
                  from: fromUser
                }
              }));
            }
          });
        }
      });
    });
  }
}
