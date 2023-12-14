import User from "../models/User"
import { matchDaysDifference } from "../utils/functions"

export const checkSubscription = async (req: Request, res: Response) => {
  // GET ALL USERS
  const users = await User.find()
  
  // LOOP THROUGH THE USERS
  users.forEach(async (user) => {

    // COMPARE THE SUBSCRIPTION DATE
    const hasExpired = matchDaysDifference(user.lastSubcriptionDate as any)
    if(!hasExpired) return 

    // UPDATE THE USER'S SUBSCRIPTION
    user.isSubscribed = false
    await user.save() 
  })
}
