import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signupInput,signinInput } from '@alamashraf123/medium-common'

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string,
      JWT_SECRET: string
    }
  }>()

userRouter.post("signup", async (c) =>{
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const { success }= signupInput.safeParse(body)
    if(!success){
      c.status(411)
      return c.text("Incorrect sign up credentials")
    }
    try{
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.name
        } 
      })
      const token = await sign({
        id: user.id},c.env.JWT_SECRET)
      return c.text(token)
    }catch(e){
      c.status(403);
      return c.text('Error in signing up')
    }
  })
  
userRouter.post("/signin", async (c) =>{
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const { success }= signinInput.safeParse(body)
    if(!success){
      c.status(411)
      return c.text("Incorrect signing in credentials")
    }
    try{
    const user = await prisma.user.findFirst({
    where: {
        email: body.email,
        password: body.password}
    })
    if(!user){
    c.status(403)
    return c.text('Invalid User')
    }
    c.status(200)
    const token = await sign({
        id: user.id
    },c.env.JWT_SECRET)
    return c.text(token)
    }catch(e){
    console.log(e);
    c.status(403);
    return c.text('Error in signing in')
    }
    })
  
