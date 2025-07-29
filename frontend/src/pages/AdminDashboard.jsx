import { useEffect, useState } from "react";
import {authUrl} from "../config/config.js"
import axios from "axios"
import toast from "react-hot-toast";

function AdminDashboard() {

    const [data, setData] = useState({
        email: "",
        username: "",
        contactNumber: "",
        fullName: ""
    });

    const [allUsers, setAllUsers] = useState([]);

    const userProfile = () => {
        axios.get(`${authUrl}/admin/profile`, {
            withCredentials: true
        })
        .then((res) => {
            setData({
                email: res.data.data.email,
                username: res.data.data.username,
                contactNumber: res.data.data.contactNumber,
                fullName: res.data.data.fullName
            })
        })
        .catch((err) => {
            console.log("Something went wrong while fetching the user profile : ", err)
            toast.error("Something went wrong while fetching your profile !!")
        })
    }

    const allUsersProfile = () => {
        axios.get(`${authUrl}/admin/allUsers`, {
            withCredentials: true
        })
        .then((res) => {
            setAllUsers(res.data.data)
        })
        .catch((err) => {
            console.log("Something went wrong while fetching all the users : ", err)
            toast.error("Something went wrong while fetching all the users !!")
        })
    }

    const deleteUser = (userId) => {
        axios.post(`${authUrl}/admin/removeUser`, {userId}, {
            withCredentials: true
        })
        .then((res) => {
            console.log(res);
            window.location.reload();
        })
        .catch((err) => {
            console.log("Something went wrong while deleting the user : ", err)
            toast.error(err.response.data.message)
        })
    }

    useEffect(() => {
        userProfile();
        allUsersProfile();
    }, [])

    return (
        <div>

            {/* for showing the admin details  */}
            <div
            className="min-w-[50%] flex flex-col items-center justify-center p-2 border-2 m-2 bg-linear-to-t from-sky-500 to-indigo-500"
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

            <div>
                {/* for showing the details of all the users */}
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">All Users</h1>

                    {allUsers.length === 0 ? (
                        <p>No users found.</p>
                    ) : (
                        <table className="min-w-full bg-blue-300 shadow rounded-xl">
                        <thead>
                            <tr className="bg-blue-400 text-left">
                            <th className="p-2">Username</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Full Name</th>
                            <th className="p-2">Contact</th>
                            <th className="p-2">Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.map((user) => (
                            <tr key={user.id} className="">
                                <td className="p-2">{user.username}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">{user.fullName}</td>
                                <td className="p-2">{user.contactNumber}</td>
                                <td className="p-2">{user.isAdmin ? "Yes" : "No"}</td>
                                <td className="text-center"><button className="cursor-pointer" onClick={() => deleteUser(user.id)}>delete</button></td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    )}
                </div>

                {/* for adding the blacklist emails */}
                <div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard