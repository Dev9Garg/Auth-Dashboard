import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { authUrl } from "../config/config.js"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext.jsx"

export default function UpdateUserDetails() {

    const {user} = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        contactNumber: ""
    })

    const [loading, setLoading] = useState(false);

    const isFormValid = !(formData.fullName || formData.contactNumber);

    const handleOnClick = () => {
        setLoading(true);

        axios.patch(`${authUrl}/users/updateDetails`, formData, {
            headers: {"Content-Type": "application/json"},
            withCredentials: true
        })
        .then(() => {
            setLoading(false);
            toast.success("details updated successfully !")
            navigate(`/user/dashboard`)
        })
        .catch((err) => {
            console.log("something went wrong while updating the details of the user : ", err)
            toast.error("Something went wrong !!")
            setLoading(false);
        })
    }

    return (
        <div className="flex justify-center items-center mt-8">
            <div className="flex flex-col border-2 rounded-xl bg-white">
                <h1 className="font-medium text-center text-black text-2xl p-4 m-4">Update the details</h1>

                <label 
                htmlFor="fullNameInput"
                className="ml-4 font-sans font-medium"
                >
                    Full Name : 
                </label>

                <input 
                name="fullName"
                id="fullNameInput"
                type="text" 
                placeholder="Enter your full name ..."
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                value={formData.fullName}
                className="border border-black rounded bg-white p-4 m-4"
                />

                <label 
                htmlFor="contactNumberInput"
                className="ml-4 font-sans font-medium"
                >
                    Contact Number : 
                </label>

                <input 
                name="contactNumber"
                id="contactNumberInput"
                type="text" 
                placeholder="Enter your full name ..."
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                value={formData.contactNumber}
                className="border border-black rounded bg-white p-4 m-4"
                />

                <button
                className="border text-white rounded-xl p-4 m-4 cursor-pointer bg-black disabled:cursor-not-allowed"
                onClick={handleOnClick}
                disabled={isFormValid || loading}
                >
                    {loading ? "Updating ..." : "Update"}
                </button>
            </div>
        </div>
    )
}