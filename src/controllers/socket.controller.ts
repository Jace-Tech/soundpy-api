import { Server as ServerType } from "node:http";
import { Server } from "socket.io"
import { verifyToken } from "../utils/token";
import User from "../models/User";

export default function (server: ServerType) {
	const io = new Server(server)
	const connectedUsers = {} as { [key: string]: string }


	// AUTHENTICATION
	io.use(async (socket, next) => {
		try {
			const token = socket.handshake.query.token;
			if (!token) throw new Error("Invalid token")
			const { userId } = verifyToken(token as string)

			const user = await User.findById(userId)
			if (!user) throw new Error("User not found");
			socket.data.user = user
			next()
		} catch (error: any) {
			console.error("ERROR [SOCKET]: ", error.message)
			socket.disconnect()
		}
	})


	// 	HANDLE CONNECTION
	io.on('connection', (socket) => {
		const userId = socket.data.user._id ;

		// STORE USER IN MAP
		connectedUsers[userId] = socket.id

		// SEND CONNECTED USERS
		socket.broadcast.emit("connected-users", connectedUsers)



		socket.on('disconnect', () => {
			delete connectedUsers[socket.id]
			io.emit("connected-users", connectedUsers)
		});
	});

}