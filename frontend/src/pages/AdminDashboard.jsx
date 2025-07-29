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
    const [blacklistedEmails, setBlacklistedEmails] = useState([]);
    const [emailToBeBlacklisted, setEmailToBeBlacklisted] = useState("");

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
            allUsersProfile();
            toast.success("profile deleted successfully !!")
        })
        .catch((err) => {
            console.log("Something went wrong while deleting the user : ", err)
            toast.error(err.response.data.message)
        })
    }

    const addEmail = () => {
        axios.post(`${authUrl}/admin/addEmail`, {emailToBeBlacklisted}, {
            withCredentials: true
        })
        .then((res) => {
            allEmail();
            setEmailToBeBlacklisted("")
            toast.success("Email added successfully !!")
        })
        .catch((err) => {
            console.log("Something went wrong while adding the email : ", err)
            toast.error(err.response.data.message)
        })
    }

    const allEmail = () => {
        axios.get(`${authUrl}/admin/allEmails`, {
            withCredentials: true
        })
        .then((res) => {
            setBlacklistedEmails(res.data.data)
        })
        .catch((err) => {
            console.log("Something went wrong while fetching all the blacklisted emails : ", err)
            toast.error(err.response.data.message)
        })
    }

    const deleteEmail = (emailId) => {
        axios.post(`${authUrl}/admin/removeEmail`, {emailId}, {
            withCredentials: true
        })
        .then((res) => {
            allEmail();
            toast.success("email de-blacklisted successfully !!")
        })
        .catch((err) => {
            console.log("Something went wrong while de-blacklisting the email : ", err)
            toast.error(err.response.data.message)
        })
    }

    useEffect(() => {
        userProfile();
        allUsersProfile();
        allEmail();
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

            <div
            className="flex justify-items-center-safe"
            >
                {/* for showing the details of all the users */}
                <div className="p-4 m-4">
                    <h1 className="text-2xl font-bold mb-4">All Users</h1>

                    {allUsers.length === 0 ? (
                        <p>No users found.</p> ) 
                        : 
                        (
                            <table className="min-w-full bg-blue-300 shadow rounded-xl">
                                <thead>
                                    <tr className="bg-blue-400 text-left">
                                    <th className="p-2">Username</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Full Name</th>
                                    <th className="p-2">Contact</th>
                                    <th className="p-2">Admin</th>
                                    <th className="p-2"></th>
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
                                            <td className="text-center p-2">
                                                <button 
                                                className="cursor-pointer border rounded-2xl bg-red-600 p-2" 
                                                onClick={() => deleteUser(user.id)}
                                                >
                                                    delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    }
                </div>

                {/* for adding the blacklist emails */}
                <div
                className="p-4 m-4"
                >

                    <h1
                    className="text-2xl font-bold mb-4"
                    >
                        Blacklisted Emails
                    </h1>

                    <div
                    className="border rounded-4xl bg-pink-600 flex flex-col items-start justify-center"
                    >
                        <div
                        className="p-1 m-1"
                        >
                            <input 
                            type="text" 
                            className="bg-white border rounded-4xl p-2 m-2"
                            onChange={(e) => setEmailToBeBlacklisted(e.target.value)}
                            value={emailToBeBlacklisted}
                            placeholder="Enter the email..."
                            />

                            <button
                            className="cursor-pointer border rounded-2xl bg-red-600 p-2 m-2"
                            onClick={addEmail}
                            >
                                Add
                            </button>
                        </div>

                        <div
                        className="p-1 m-1"
                        >
                            {blacklistedEmails.length === 0 ? (
                                <p
                                className="p-2 m-2"
                                >No emails are blacklisted.</p>
                                ) : (
                                    <div
                                    >
                                        {blacklistedEmails.map((email) => (
                                            <div 
                                            key={email.id}  
                                            className="flex justify-between m-2" 
                                            >
                                                <div
                                                className="p-2 m-2 bg-orange-500 rounded-2xl"
                                                >
                                                    {email.email}
                                                </div>

                                                <button 
                                                className="cursor-pointer border rounded-2xl bg-red-600 p-2" 
                                                onClick={() => deleteEmail(email.id)}
                                                >
                                                    delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard