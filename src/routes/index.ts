import { Router } from 'express';

import notificationRoute from './notification.routes';
import uploadRoute from './upload.routes';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import contentRoutes from './content.routes';
import playlistRoutes from './playlist.routes';
import userRoutes from './user.routes';
import paymentRoutes from './payment.routes';
import genreRoutes from './genre.routes';
import settingsRoutes from './settings.routes';
import transactionRoute from './transactions.routes';


const routes = Router()

routes.use("/upload", uploadRoute)
routes.use("/user", userRoutes)
routes.use("/auth", authRoutes)
routes.use("/genre", genreRoutes)
routes.use("/profile", profileRoutes)
routes.use("/content", contentRoutes)
routes.use("/settings", settingsRoutes)
routes.use("/playlist", playlistRoutes)
routes.use("/payment", paymentRoutes)
routes.use("/notification", notificationRoute)
routes.use("/transaction", transactionRoute)

export default routes