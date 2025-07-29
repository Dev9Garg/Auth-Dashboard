// import from libraries
import { useState } from "react";
import {useNavigate, Link} from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"

// import from files
import { useAuth } from "../context/AuthContext.jsx";
import {authUrl} from "../config/config.js"

function Login () {

    const navigate = useNavigate();

    const {setUser} = useAuth();

    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    })

    const [loading, setLoading] = useState(false);

    const isFormComplete = !formData.identifier || !formData.password || loading;

    const handleOnClick = () => {

        setLoading(true);

        axios.post(`${authUrl}/users/login`, formData, {
            headers: {"Content-Type": "application/json"},
            withCredentials: true
        })
        .then((res) => {
            setLoading(false);
            setUser(res.data.data.user)
            toast.success("Logged in successfully !!");
    
            if(res.data.data.user.isAdmin) {
                navigate("/admin/dashboard")
            }else {
                navigate("/user/dashboard")
            }
        })
        .catch((err) => {
            console.log("Something went wrong while logging in : ", err);
            toast.error(err.response.data.message)
            setLoading(false);
        })
    }

    return (
        <div
        className="flex justify-center items-center"
        >
            <div
            className="flex flex-col border rounded-4xl bg-cyan-400 p-4 m-4"
            >

                <h1
                className="text-3xl font-bold text-center p-4 m-4"
                >
                    Login Form

                    <p className="text-sm font-light">Already have an account ? <Link className="text-blue-800 underline decoration-sky-500" to="/user/signup">SignUp</Link></p>
                </h1>

                <label 
                htmlFor="emailOrUsernameInput"
                className="ml-4 font-bold"
                >
                    Email or Username : 
                </label>

                <input 
                name="email"
                id="emailOrUsernameInput"
                type="text" 
                placeholder="Enter email or username ..."
                onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                value={formData.identifier}
                className="border rounded-4xl bg-white p-4 m-4"
                />

                <label 
                htmlFor="passwordInput"
                className="ml-4 font-bold"
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
                className="border rounded-4xl bg-white p-4 m-4"
                />


                <button
                className="border rounded-4xl p-4 m-4 cursor-pointer bg-green-400 disabled:cursor-not-allowed disabled:bg-green-300"
                onClick={handleOnClick}
                disabled={isFormComplete}
                >
                    {loading ? "Logging you in ..." : "Login"}
                </button>
            </div>
        </div>
    )
}

export default Login;