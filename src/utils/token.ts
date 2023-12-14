import { sign, verify } from "jsonwebtoken"

interface TokenResponse {
  userId: string | number;
  role: string;
}

export const generateToken = (data: TokenResponse | any, expiresIn: string | number = "1y") => {
  if(typeof data === "object") {
    const token = sign({ ...data }, process.env.JWT_SECRET as string, { expiresIn })
    const expiryTime = verifyToken(token).exp
    return { token, expiryTime }
  }
  const token = sign({ data }, process.env.JWT_SECRET as string, { expiresIn })
  const expiryTime = verifyToken(token).exp
  return { token, expiryTime }
}

export const verifyToken = (token: string) => verify(token, process.env.JWT_SECRET as string) as TokenResponse | any



generateToken("Jace")
