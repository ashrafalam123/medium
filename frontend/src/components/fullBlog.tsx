import { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard"

export const FullBlog = ({blog} : {blog: Blog}) => {
    return  <div> 
        <Appbar />
    <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full pt-20 max-w-screen-xl">
            <div className="grid col-span-8 ">
                <div className="text-5xl font-extrabold pb-3">{blog.title}</div>
                <div className="text-slate-500 pb-5">Posted on 2nd December 2023</div>
                <div className="">{blog.content}</div>
            </div>
            <div className="col-span-4 ">
                <div className="pb-2 font-semibold">Author</div>
                <div className="px-4 flex justify-center">
                    <div className="flex flex-col justify-center pr-2">
                        <Avatar size="big" name={blog.author.name || "Anonymous"} /> 
                    </div>
                    <div className="pl-4">
                        <div className = "text-xl font-bold pb-4">{blog.author.name || "Anonymous"}</div>
                        <div className="text-slate-500">Details about the author or a quick short bio about the genre the author is 
                            interested in posting
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
}