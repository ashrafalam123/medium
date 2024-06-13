import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { createBlogInput,updateBlogInput } from '@alamashraf123/medium-common'

export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string,
      JWT_SECRET: string
    },
    Variables: {
      userId: string
    }
  }>()

blogRouter.use('/*', async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  try{
    const authHeader = c.req.header("authorization") || "";
    const user = await verify(authHeader,c.env.JWT_SECRET)
    if(user){
      //@ts-ignore
      c.set("userId", user.id);
      await next();
    }else{
      c.status(403)
      return c.json({
        "message" : "Log in to access this page"
      })
    }
  }catch(e){
    console.log(e)
    c.status(403)
    c.text("Error occurred")
  }
})

blogRouter.post("/",async (c) => {
  const body = await c.req.json();
  const userId = c.get("userId")
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const { success } = createBlogInput.safeParse(body)
    if(!success){
      c.status(400)
      return c.text("Send the correct blog format")
    }
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId:  Number(userId)
      }
    })
    return c.json({
      id: blog.id
    })
  })
  
blogRouter.put("/",async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const { success } = updateBlogInput.safeParse(body)
    if(!success){
      c.status(400)
      return c.text("Send the correct blog format for update")      
    }
    const blog = await prisma.blog.update({
      where: {
        id: body.id
      },
      data: {
        title: body.title,
        content: body.content
      }
    })
    return c.json({
      id: blog.id
    })
})

//add pagination logic
blogRouter.get("/bulk", async (c) =>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blogs = await prisma.blog.findMany();
    return c.json({
      blogs})
})
  
blogRouter.get("/:id", async (c) =>{
  const id =  c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(id)
      }
    })
    c.status(200)
    return c.json({
       blog
    })
  }catch(e){
      c.status(411)
      console.log(e)
      c.text("Failed to fetch the blog")
    }
})

