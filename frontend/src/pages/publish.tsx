import { Appbar } from "../components/Appbar"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const navigate = useNavigate();
    return<div>
    <Appbar />
    <div className="pt-20 flex justify-center w-screen px-10">
        <div className="w-3/4">
            <input onChange = {(e)=>{
                setTitle(e.target.value)
            }}
            type="text" placeholder="Title" className="w-full block p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            <div className="pt-10">
            <TextEditor onChange = {(e)=> {
                setDescription(e.target.value)
            }}/>
            <button type="submit" onClick= {async ()=>{
                const response = await axios.post(`${BACKEND_URL}/api/v1/blog`,{
                    title,
                    content: description
                },{
                    headers:{
                        Authorization: localStorage.getItem("token")
                    }
                });
                navigate(`/blog/${response.data.id}`)
            }} className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                Publish post
            </button>
            </div>
        </div>
    </div>
    </div>
}

function TextEditor({onChange} : {onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void}){
    return <div>
       <div className="w-full mb-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
           <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
               <textarea onChange = {onChange} id="editor" rows={18} className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write an article..." required ></textarea>
           </div>
       </div>
    </div>
}

