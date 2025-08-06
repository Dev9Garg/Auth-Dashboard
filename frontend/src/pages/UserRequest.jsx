import { authUrl } from "@/config/config";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useState } from "react"
import toast from "react-hot-toast";

export default function UserRequest() {
    const {user} = useAuth();

    const [formData, setFormData] = useState({
        desiredEmail: "",
        password: "",
        userId: user.id
    })

    const [loading, setLoading] = useState(false);

    const isFormComplete = !formData.desiredEmail || !formData.password || loading;

    const handleOnClick = () => {

        setLoading(true);

        axios.post(`${authUrl}/users/request/checkDetails`, formData, {
            headers: {"Content-Type": "application/json"},
            withCredentials: true
        })
        .then(() => {
            setLoading(false);
            toast.success("Request sent successfully !!")
            setFormData((prev) => ({
                ...prev,
                desiredEmail: "",
                password: ""
            }))
        })
        .catch((err) => {
            console.log("Something went wrong while sending the request : ", err);
            toast.error(err.response.data.message)
            setLoading(false);
            setFormData((prev) => ({
                ...prev,
                desiredEmail: "",
                password: ""
            }))
        })
    }

    return (
        <div
        className="flex justify-center items-center"
        >
            <div
            className="flex flex-col border rounded-2xl bg-white p-4 m-4 min-w-md"
            >

                <h1
                className="text-3xl font-medium text-center p-4 m-4"
                >
                    Email update Request
                </h1>

                <label 
                htmlFor="emailInput"
                className="ml-4 font-sans font-medium"
                >
                    Desired Email : 
                </label>

                <input 
                name="email"
                id="emailInput"
                type="text" 
                placeholder="Enter email ..."
                onChange={(e) => setFormData(prev => ({ ...prev, desiredEmail: e.target.value }))}
                value={formData.desiredEmail}
                className="border border-black rounded bg-white p-4 m-4"
                />

                <label 
                htmlFor="passwordInput"
                className="ml-4 font-sans font-medium"
                >
                    Password : 
                </label>

                <input 
                name="password"
                id="passwordInput"
                type="password" 
                placeholder="Enter your password ..."
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                value={formData.password}
                className="border border-black rounded bg-white p-4 m-4"
                />


                <button
                className="border text-white rounded-xl p-4 m-4 cursor-pointer bg-black disabled:cursor-not-allowed"
                onClick={handleOnClick}
                disabled={isFormComplete}
                >
                    {loading ? "Sending the request ..." : "Send the request"}
                </button>
            </div>
        </div>
    )
}