import { useEffect, useState } from "react";
import {authUrl} from "../config/config.js"
import axios from "axios"
import toast from "react-hot-toast";

function Dashboard () {

    const [data, setData] = useState({
        email: "",
        username: "",
        contactNumber: "",
        fullName: ""
    });

    const userProfile = () => {
        axios.get(`${authUrl}/users/profile`, {
            withCredentials: true
        })
        .then((res) => {
            setData({
                email: res.data.data.email,
                username: res.data.data.username,
                contactNumber: res.data.data.contactNumber,
                fullName: res.data.data.fullName
            })

            toast.success(res.data.message);
        })
        .catch((err) => {
            console.log("Something went wrong while fetching the user profile : ", err)
            toast.error("Something went wrong while fetching your profile !!")
        })
    }

    useEffect(() => {
        userProfile();
    }, [])

    return (
        <div
        className="flex justify-center m-44"
        >
            <div
            className="flex flex-col items-center justify-center p-2 border-2 m-2 bg-linear-to-t from-sky-500 to-indigo-500"
            >
                <div
                className="p-4"
                >
                    <img 
                    className="w-20 h-20 rounded-full"
                    src="/icon.jpg" 
                    alt="user profile photo" 
                    />
                </div>

                <div>
                    {data.email === undefined && data.username === undefined
                    ? "was not able to fetch profile successfully !!" 
                    : <div>
                        <p
                        className="border rounded-2xl m-2 p-2 bg-violet-400"
                        >
                            <span
                            className="font-bold"
                            >
                                username:
                            </span> 
                            
                            <span
                            className="font-bold ml-2"
                            >
                                {data.username}
                            </span>
                        </p>

                        <p
                        className="border rounded-2xl m-2 p-2 bg-violet-400"
                        >
                            <span
                            className="font-bold"
                            >
                                email:
                            </span> 
                            
                            <span
                            className="font-bold ml-2"
                            >
                                {data.email}
                            </span>
                        </p>

                        <p
                        className="border rounded-2xl m-2 p-2 bg-violet-400"
                        >
                            <span
                            className="font-bold"
                            >
                                full name:
                            </span> 
                            
                            <span
                            className="font-bold ml-2"
                            >
                                {data.fullName}
                            </span>
                        </p>

                        <p
                        className="border rounded-2xl m-2 p-2 bg-violet-400"
                        >
                            <span
                            className="font-bold"
                            >
                                contact number:
                            </span> 
                            
                            <span
                            className="font-bold ml-2"
                            >
                                {data.contactNumber}
                            </span>
                        </p>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Dashboard;