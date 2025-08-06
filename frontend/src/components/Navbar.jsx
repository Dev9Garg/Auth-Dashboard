import {useAuth} from "../context/AuthContext.jsx"
import {Link} from "react-router-dom"
import {authUrl} from "../config/config.js"
import axios from "axios"
import toast from "react-hot-toast";
import { useState } from "react";

function Navbar () {

    const {user, setUser} = useAuth();

    const [selectedValue, setSelectedValue] = useState("");

    const handleLogout = () => {
        axios.post(`${authUrl}/users/logout`, {}, {
            withCredentials: true
        })
        .then(() => {
            toast.success("User logged out successfully !!");
            setUser(null);
        })
        .catch((err) => {
            console.log("Something went wrong while logging out the user : ", err);
            toast.error("Something went wrong while logging you out !!")
        })
    }

    return (
        <div className="flex justify-center items-center">
        <div
        className="bg-black border rounded-full p-4 m-4 flex justify-between sticky top-4 min-w-4xl"  
        >
            <div>
                <h1
                className="font-medium text-white"
                >
                    Auth-Dashboard
                </h1>
            </div>

            <div
            className="flex justify-evenly w-[40rem]"
            >
                <button
                className="font-medium text-white"
                >
                    <Link to="/">Home</Link>
                </button>

                {user 
                ? ((user.isAdmin)
                ? <div className="flex space-x-4"> 
                    <button
                    className="font-medium text-white"
                    >
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </button>
                
                    <button
                    className="font-medium text-white"
                    >
                        <Link to="/admin/dashboard/all-Users">All Users</Link>
                    </button>
                
                    <button
                    className="font-medium text-white"
                    >
                        <Link to="/admin/dashboard/blacklisted-emails">Blacklisted Emails</Link>
                    </button>

                    <button
                    className="font-medium text-white"
                    >
                        <Link to="/user/update-details">Update Details</Link>
                    </button>

                    <button
                    className="font-medium text-white"
                    >
                        <Link to="/admin/dashboard/all-requests">Inbox</Link>
                    </button>
                </div> 
                : <div className="flex space-x-4">
                    <button
                    className="font-medium text-white"
                    >
                        <Link to="/user/dashboard">Dashboard</Link>
                    </button>

                    <button
                    className="font-medium text-white"
                    >
                        <Link to="/user/update-details">Update Details</Link>
                    </button>

                    <button
                    className="font-medium text-white"
                    >
                        <Link to="/user/send-request">Send a request</Link>
                    </button>
                </div> 
                )
                : ""}
            </div>

            {user 
            ? <div>
                <button
                className="cursor-pointer font-medium text-white"
                onClick={handleLogout}
                >
                    logout
                </button>
            </div> 
            : <div className="flex justify-evenly w-[10rem]">
                <button
                className="font-medium text-white"
                >
                    <Link to="/user/signup">Signup</Link>
                </button>

                <button
                className="font-medium text-white"
                >
                    <Link to="/user/login">Login</Link>
                </button>
            </div>}
        </div>
        </div>
    )
}

export default Navbar;