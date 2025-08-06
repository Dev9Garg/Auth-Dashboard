import { useEffect, useState } from "react";
import {authUrl} from "../config/config.js"
import axios from "axios"
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faChessKing } from "@fortawesome/fontawesome-free-solid";
import { useAuth } from "@/context/AuthContext.jsx";
import { emailValidation } from "@/schema/signUpSchema.js";

export default function AllUsers() {

    const {user} = useAuth();
    const currentUser = user;

    const [allUsers, setAllUsers] = useState([]);

    const [allUserLoading, setAllUserLoading] = useState(false);
    const [deleteUserLoading, setDeleteUserLoading] = useState(false);
    const [removeAdminLoading, setRemoveAdminLoading] = useState(false);
    const [makeAdminLoading, setMakeAdminLoading] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [fieldValue, setFieldValue] = useState("");
    const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
    const [blacklistEmailLoading, setBlacklistEmailLoading] = useState(false);
    const [deblacklistEmailLoading, setDeBlacklistEmailLoading] = useState(false);
    const [makingUserActiveLoading, setMakingUserActiveLoading] = useState(false);
    const [makingUserInactiveLoading, setMakingUserInactiveLoading] = useState(false);
    const [showInactiveModal, setShowInactiveModal] = useState(false);
    const [inactiveUntil, setInactiveUntil] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);

    // admin profile fetching api
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

    // user deletion api
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

    // admin toggle api's
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

    // update user email api
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

    // blacklist email api's 
    const blacklistEmail = (userEmail) => {
        setBlacklistEmailLoading(true);

        const result = emailValidation.safeParse(userEmail)

        if(!result.success) {
            toast.error("Enter a valid email !!");
            setBlacklistEmailLoading(false);
            return;
        }

        axios.post(`${authUrl}/admin/addEmail`, {emailToBeBlacklisted: userEmail}, {
            withCredentials: true
        })
        .then(() => {
            toast.success("Email added successfully !!")
            setBlacklistEmailLoading(false);
            allUsersProfile();
        })
        .catch((err) => {
            console.log("Something went wrong while adding the email : ", err)
            toast.error(err.response.data.message)
            setBlacklistEmailLoading(false);
        })
    }

    const deblacklistEmail = (userEmail) => {
        setDeBlacklistEmailLoading(true);

        axios.post(`${authUrl}/admin/removeEmail`, {email: userEmail}, {
            withCredentials: true
        })
        .then(() => {
            toast.success("email de-blacklisted successfully !!")
            setDeBlacklistEmailLoading(false);
            allUsersProfile();
        })
        .catch((err) => {
            console.log("Something went wrong while de-blacklisting the email : ", err)
            toast.error(err.response.data.message)
            setDeBlacklistEmailLoading(false);
        })
    }

    // user status api's
    const makeUserStatusActive = (userId) => {
        setMakingUserActiveLoading(true);

        axios.post(`${authUrl}/admin/statusActive`, {userId}, {
            withCredentials: true
        })
        .then(() => {
            toast.success("User status set to active successfully !!")
            setMakingUserActiveLoading(false);
            allUsersProfile();
        })
        .catch((err) => {
            console.log("Something went wrong while changing the status of the user : ", err)
            toast.error(err.response.data.message)
            setMakingUserActiveLoading(false);
        })
    }

    const makeUserStatusInactive = (userId) => {
        if (!inactiveUntil) {
            alert("Please select a date and time");
            return;
        }

        setMakingUserInactiveLoading(true);

        axios.post(`${authUrl}/admin/statusInactive`, {
            userId: selectedUserId,
            inactiveUntil: new Date(inactiveUntil).toISOString()
        }, {
            withCredentials: true
        })
        .then(() => {
            toast.success("User status set to inactive successfully !!")
            setMakingUserInactiveLoading(false);
            setShowInactiveModal(false);
            allUsersProfile();
        })
        .catch((err) => {
            console.log("Something went wrong while changing the status of the user : ", err)
            toast.error(err.response.data.message)
            setMakingUserInactiveLoading(false);
        })
    }

    const handleInactiveButtonOnClick = (userId) => {
        setSelectedUserId(userId);
        setInactiveUntil(""); 
        setShowInactiveModal(true);
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
                                    <tr key={user.id}>
                                        <td className="p-2">{user.username} 
                                            {user.status === "inactive" && 
                                                <span className="bg-gray-400 m-2 p-2">
                                                    inactive
                                                </span> 
                                            }
                                        </td>

                                        {(currentUser.id === user.id)

                                        ? <td className="p-2">{user.email}</td>

                                        : <div>
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

                                            : <td className="p-2">{user.email}
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

                                        </div>
                                        }
                                        
                                        <td className="p-2">{user.fullName}</td>
                                        <td className="p-2">{user.contactNumber}</td>
                                        <td className="p-2">{user.isAdmin ? "Yes" : "No"}</td>

                                        {(currentUser.id === user.id)

                                        ? <div></div>

                                        : <div className="flex justify-evenly">
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
                                                className="cursor-pointer mt-2 rounded bg-red-500 p-2 disabled:bg-red-400 disabled:cursor-not-allowed" 
                                                onClick={() => removeAdmin(user.id)}
                                                disabled={removeAdminLoading}
                                                >
                                                    Admin <FontAwesomeIcon icon={faBan} size="sm" />
                                                </button>
                                            </td>

                                            : <td>
                                                <button 
                                                className="cursor-pointer mt-2 rounded bg-green-500 p-2 disabled:bg-green-400 disabled:cursor-not-allowed" 
                                                onClick={() => makeAdmin(user.id)}
                                                disabled={makeAdminLoading}
                                                >
                                                    Admin <FontAwesomeIcon icon={faChessKing} size="sm" />
                                                </button>
                                            </td>
                                            }

                                            {user.isBlacklisted
                                            ? <td>
                                                <button 
                                                className="cursor-pointer mt-2 rounded bg-green-500 p-2 disabled:bg-green-400 disabled:cursor-not-allowed" 
                                                onClick={() => deblacklistEmail(user.email)}
                                                disabled={deblacklistEmailLoading}
                                                >
                                                    De-Blacklist
                                                </button>
                                            </td>
                                            : <td>
                                                <button 
                                                className="cursor-pointer mt-2 rounded bg-red-500 p-2 disabled:bg-red-400 disabled:cursor-not-allowed" 
                                                onClick={() => blacklistEmail(user.email)}
                                                disabled={blacklistEmailLoading}
                                                >
                                                    Blacklist
                                                </button>
                                            </td>
                                            }

                                            {user.status === "inactive"
                                            ? <td>
                                                <button 
                                                className="cursor-pointer mt-2 rounded bg-green-500 p-2 disabled:bg-green-400 disabled:cursor-not-allowed" 
                                                onClick={() => makeUserStatusActive(user.id)}
                                                disabled={makingUserActiveLoading}
                                                >
                                                    active
                                                </button>
                                            </td>
                                            : <td>
                                                <button 
                                                className="cursor-pointer mt-2 rounded bg-red-500 p-2 disabled:bg-red-400 disabled:cursor-not-allowed" 
                                                onClick={() => handleInactiveButtonOnClick(user.id)}
                                                disabled={makingUserInactiveLoading}
                                                >
                                                    inactive
                                                </button>
                                            </td>
                                            }

                                            {showInactiveModal && (
                                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                                <div className="bg-white p-6 rounded shadow-lg">
                                                    <h2 className="mb-4 text-lg font-semibold">Set inactive until</h2>

                                                    <input
                                                    type="datetime-local"
                                                    value={inactiveUntil}
                                                    onChange={(e) => setInactiveUntil(e.target.value)}
                                                    className="border p-2 rounded w-full"
                                                    />

                                                    <div className="mt-4 flex justify-end space-x-2">
                                                    <button
                                                        className="px-4 py-2 bg-gray-300 rounded"
                                                        onClick={() => setShowInactiveModal(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-400 disabled:cursor-not-allowed"
                                                        onClick={makeUserStatusInactive}
                                                        disabled={makingUserInactiveLoading}
                                                    >
                                                        {makingUserInactiveLoading ? "Saving..." : "Save"}
                                                    </button>
                                                    </div>
                                                </div>
                                                </div>
                                            )}

                                        </div>
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