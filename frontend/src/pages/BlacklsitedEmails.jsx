import { useEffect, useState } from "react";
import {authUrl} from "../config/config.js"
import axios from "axios"
import toast from "react-hot-toast";
import { emailValidation } from "@/schema/signUpSchema.js";

export default function BlacklistedEmails() {

    const [blacklistedEmails, setBlacklistedEmails] = useState([]);
    const [emailToBeBlacklisted, setEmailToBeBlacklisted] = useState("");

    const [addEmailloading, setAddEmailLoading] = useState(false);
    const [allEmailloading, setAllEmailLoading] = useState(false);
    const [deleteEmailloading, setDeleteEmailLoading] = useState(false);

    const addEmail = () => {
        setAddEmailLoading(true);

        const result = emailValidation.safeParse(emailToBeBlacklisted)

        if(!result.success) {
            toast.error("Enter a valid email !!");
            setAddEmailLoading(false);
            return;
        }

        axios.post(`${authUrl}/admin/addEmail`, {emailToBeBlacklisted}, {
            withCredentials: true
        })
        .then(() => {
            allEmail();
            setEmailToBeBlacklisted("")
            toast.success("Email added successfully !!")
            setAddEmailLoading(false);
        })
        .catch((err) => {
            console.log("Something went wrong while adding the email : ", err)
            toast.error(err.response.data.message)
            setAddEmailLoading(false);
        })
    }

    const allEmail = () => {
        setAllEmailLoading(true)

        axios.get(`${authUrl}/admin/allEmails`, {
            withCredentials: true
        })
        .then((res) => {
            setBlacklistedEmails(res.data.data)
            setAllEmailLoading(false)
        })
        .catch((err) => {
            console.log("Something went wrong while fetching all the blacklisted emails : ", err)
            toast.error(err.response.data.message)
            setAllEmailLoading(false)
        })
    }

    const deleteEmail = (emailId) => {
        setDeleteEmailLoading(true);

        axios.post(`${authUrl}/admin/removeEmail`, {emailId}, {
            withCredentials: true
        })
        .then(() => {
            allEmail();
            toast.success("email de-blacklisted successfully !!")
            setDeleteEmailLoading(false);
        })
        .catch((err) => {
            console.log("Something went wrong while de-blacklisting the email : ", err)
            toast.error(err.response.data.message)
            setDeleteEmailLoading(false);
        })
    }

    useEffect(() => {
        allEmail();
    }, [])

    if(allEmailloading) {
        return (
            <div
            className="flex justify-center items-center"
            >
                Loading ...
            </div>
        )
    }

    return (
        <div>
            <div
            className="p-4 m-4 flex justify-center items-center"
            >
                <div
                className="border rounded-xl bg-white flex flex-col items-start justify-center"
                >
                    <div
                    className="p-2 m-2"
                    >
                        <input 
                        type="text" 
                        className="bg-white border border-black rounded p-2 m-2"
                        onChange={(e) => setEmailToBeBlacklisted(e.target.value)}
                        value={emailToBeBlacklisted}
                        placeholder="Enter the email..."
                        />

                        <button
                        className="cursor-pointer rounded bg-red-500 p-2 m-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                        onClick={addEmail}
                        disabled={addEmailloading}
                        >
                            {addEmailloading ? "Adding ..." : "Add"}
                        </button>
                    </div>

                    <div
                    className="p-1 m-1 items-center"
                    >
                        {blacklistedEmails.length === 0 
                        ? 
                        (
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
                                        className="p-2 m-2 bg-black text-white rounded"
                                        >
                                            {email.email}
                                        </div>

                                        <span
                                        className="flex justify-center items-center"
                                        >
                                            Blocked by {email.blockedBy}
                                        </span>

                                        <button 
                                        className="cursor-pointer rounded bg-red-500 m-2 p-2 disabled:bg-red-400 disabled:cursor-not-allowed" 
                                        onClick={() => deleteEmail(email.id)}
                                        disabled={deleteEmailloading}
                                        >
                                            {deleteEmailloading ? "Deleting ..." : "Delete"}
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
    )
}