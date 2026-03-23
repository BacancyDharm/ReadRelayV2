import { NextRequest } from "next/server";
import { loginService, registerService } from "./auth.service";
import { loginSchema, registrationSchema } from "./auth.validator";

export const registerController = async (req: NextRequest) => {
  const body = await req.json();
  const parsedData = registrationSchema.safeParse(body);
  if (!parsedData.success) {
    throw new Error(parsedData.error.issues[0].message);
  }
  
  const user = await registerService(body);

  return user;
};

export const loginController = async (req: NextRequest) => {
    const body = await req.json();
    console.log("body is", body)
    const parsedData = loginSchema.safeParse(body);
    if(!parsedData.success) throw new Error(parsedData.error.issues[0].message)
    const user = await loginService(body)
    return user;
};
