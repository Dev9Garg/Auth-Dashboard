import { useEffect, useState } from "react";
import {authUrl} from "../config/config.js"
import axios from "axios"
import toast from "react-hot-toast";

export default function AllUsers() {

    const [allUsers, setAllUsers] = useState([]);

    const[allUserLoading, setAllUserLoading] = useState(false);
    const [deleteUserLoading, setDeleteUserLoading] = useState(false);

    const allUsersProfile = () => {
        setAllUserLoading(true);

        axios.get(`${authUrl}/admin/allUsers`, {
            withCredentials: true
        })
        .then((res) => {
            setAllUsers(res.data.data)
            setAllUserLoading(false);
        })
        .catch((err) => {
            console.log("Something went wrong while fetching all the users : ", err)
            toast.error("Something went wrong while fetching all the users !!")
            setAllUserLoading(false);
        })
    }

    const deleteUser = (userId) => {
        setDeleteUserLoading(true);

        axios.post(`${authUrl}/admin/removeUser`, {userId}, {
            withCredentials: true
        })
        .then(() => {
            allUsersProfile();
            toast.success("profile deleted successfully !!")
            setDeleteUserLoading(false);
        })
        .catch((err) => {
            console.log("Something went wrong while deleting the user : ", err)
            toast.error(err.response.data.message)
            setDeleteUserLoading(false);
        })
    }

    useEffect(() => {
        allUsersProfile();
    }, [])

    if(allUserLoading) {
        return (
            <div>Loading ...</div>
        )
    }

    return (
        <div>
            <div 
            className="p-4 m-4"
            >
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
                                            className="cursor-pointer rounded bg-red-500 p-2 disabled:bg-red-400 disabled:cursor-not-allowed" 
                                            onClick={() => deleteUser(user.id)}
                                            disabled={deleteUserLoading}
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
        </div>
    )
}