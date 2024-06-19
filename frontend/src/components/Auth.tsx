import { ChangeEvent } from "react";
import { Link,useNavigate } from "react-router-dom"
import { useState } from "react";
import { SignupInput } from "@alamashraf123/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: {type: "signup" | "signin"}) => {
    const navigate = useNavigate();
    const [postInputs ,setPostInputs] = useState<SignupInput>({
        name : "",
        email : "",
        password : ""
    })
    
    async function sendRequest(){
        try{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,postInputs)
        const jwt = response.data;
        localStorage.setItem("token", jwt);
        navigate("/blogs")
        }catch(e){
            alert("Failed to signup please try again")
        }
    }
    return <div className=" h-screen flex justify-center flex-col">
        <div className="flex justify-center">
        <div>
            <div className="px-10 py-15">
                <div className="text-3xl font-extrabold">
                    Create an account
                </div>
                <div className="text-slate-400 text-center">
                    {type === "signup" ? "Already have an account?" : "Don't have an Account?"} 
                    <Link className = "pl-2 underline underline-offset-2" to = {type === "signup" ? "/signin" : "/signup"}>
                        {type === "signup"? "Login" : "Signup"}
                    </Link>
                </div>
            </div>
            <div>
                {type === "signup" ? <LabelledInput label= "Name" placeholder="Name" onChange={(e)=> {
                    setPostInputs( c=> ({
                        ...c,
                        name : e.target.value
                    }))
                }}  /> : null}
                <LabelledInput label= "Email" placeholder="Email" onChange={(e)=> {
                    setPostInputs( c=> ({
                        ...c,
                        email : e.target.value
                    }))
                }}  />
                <LabelledInput label= "Password" type = {"password"} placeholder="Password" onChange={(e)=> {
                    setPostInputs( c=> ({
                        ...c,
                        password : e.target.value
                    }))
                }}  />
                <br />
                <button onClick= {sendRequest} type="button" className=" w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800
                 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
            </div>
            </div>
        </div>
    </div>
}

interface LabelledInputType  {
    label : string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string
}

function LabelledInput({label , placeholder, onChange,type}: LabelledInputType){
    return <div className="pt-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
            <input onChange = {onChange} type={ type || "text"} id="first_name" className="pt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
             dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
        </div>
}
