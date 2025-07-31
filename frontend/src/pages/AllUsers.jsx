import { useEffect, useState } from "react";
import {authUrl} from "../config/config.js"
import axios from "axios"
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faChessKing } from "@fortawesome/fontawesome-free-solid";

export default function AllUsers() {

    const [allUsers, setAllUsers] = useState([]);

    const[allUserLoading, setAllUserLoading] = useState(false);
    const [deleteUserLoading, setDeleteUserLoading] = useState(false);
    const [removeAdminLoading, setRemoveAdminLoading] = useState(false);
    const [makeAdminLoading, setMakeAdminLoading] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [fieldValue, setFieldValue] = useState("");
    const [updateEmailLoading, setUpdateEmailLoading] = useState(false);

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

    const makeAdmin = (userId) => {
        setMakeAdminLoading(true);

        axios.post(`${authUrl}/admin/makeAdmin`, {userId}, {
            withCredentials: true
        })
        .then((res) => {
            allUsersProfile();
            toast.success(res.data.message)
            setMakeAdminLoading(false);
        })
        .catch((err) => {
            console.log("Something went wrong while making the user admin : ", err)
            toast.error(err.response.data.message)
            setMakeAdminLoading(false);
        })
    }

    const removeAdmin = (userId) => {
        setRemoveAdminLoading(true);

        axios.post(`${authUrl}/admin/removeAdmin`, {userId}, {
            withCredentials: true
        })
        .then((res) => {
            allUsersProfile();
            toast.success(res.data.message)
            setRemoveAdminLoading(false);
        })
        .catch((err) => {
            console.log("Something went wrong while removing the user from the admin position : ", err)
            toast.error(err.response.data.message)
            setRemoveAdminLoading(false);
        })
    }

    const updateUserEmail = (userId) => {
        setUpdateEmailLoading(true);

        axios.patch(`${authUrl}/admin/updateUserDetails`, {email: fieldValue, userId}, {
            withCredentials: true
        })
        .then((res) => {
            allUsersProfile();
            toast.success(res.data.message)
            setUpdateEmailLoading(false);
            setEditingUserId(null);
        })
        .catch((err) => {
            console.log("Something went wrong while removing the user from the admin position : ", err)
            toast.error(err.response.data.message)
            setUpdateEmailLoading(false);
            setEditingUserId(null);
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
                                <th className="p-2">Contact Number</th>
                                <th className="p-2">Admin</th>
                                <th className="p-2"></th>
                                <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((user) => (
                                    <tr key={user.id} className="">
                                        <td className="p-2">{user.username}</td>
                                        
                                        {(editingUserId === user.id)
                                        ? <div className="flex mt-2">
                                            <input 
                                            type="text" 
                                            value={fieldValue}
                                            placeholder="Enter the new email ..."
                                            className="bg-white rounded p-2"
                                            onChange={(e) => setFieldValue(e.target.value)}
                                            />

                                            <button
                                            className="cursor-pointer ml-2 rounded bg-green-500 p-2 disabled:bg-green-400 disabled:cursor-not-allowed" 
                                            disabled={updateEmailLoading}
                                            onClick={
                                                () => updateUserEmail(user.id)}
                                            >
                                                save
                                            </button>

                                            <button
                                            className="cursor-pointer ml-2 rounded bg-red-500 p-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                                            onClick={() => setEditingUserId(null)}
                                            disabled={updateEmailLoading}
                                            >
                                                cancel
                                            </button>
                                        </div>
                                        :<td className="p-2">{user.email}
                                            <button
                                            className="cursor-pointer rounded bg-green-500 p-2 m-2" 
                                            onClick={
                                                () => {setEditingUserId(user.id);
                                                    setFieldValue(user.email);
                                                }
                                            }
                                            >
                                                edit
                                            </button>
                                        </td>
                                        }
                                        
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
                                        {user.isAdmin
                                        ? <td>
                                            <button 
                                            className="cursor-pointer rounded bg-red-500 p-2 disabled:bg-red-400 disabled:cursor-not-allowed" 
                                            onClick={() => removeAdmin(user.id)}
                                            disabled={removeAdminLoading}
                                            >
                                                Admin <FontAwesomeIcon icon={faBan} size="sm" />
                                            </button>
                                        </td>
                                        : <td>
                                            <button 
                                            className="cursor-pointer rounded bg-green-500 p-2 disabled:bg-green-400 disabled:cursor-not-allowed" 
                                            onClick={() => makeAdmin(user.id)}
                                            disabled={makeAdminLoading}
                                            >
                                                Admin <FontAwesomeIcon icon={faChessKing} size="sm" />
                                            </button>
                                        </td>
                                        }
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