// imports from libraries
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Tooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/fontawesome-free-solid'
import toast from "react-hot-toast"
import axios from "axios"

// imports from files 
import { authUrl } from "../config/config.js"

// import for schema validation 
import {signUpValidation, 
        usernameValidation, 
        passwordValidation, 
        emailValidation
} from "../schema/signUpSchema.js"



function Signup () {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const [usernameCheck, setUsernameCheck] = useState(false);
    const [emailCheck, setEmailCheck] = useState(false);
    const [passwordCheck, setPasswordCheck] = useState(false);
    const [loading, setLoading] = useState(false);

    const passwordTooltipContent = `
        <ul style="">
            <li>It's length should be atleast 6 characters.</li>
            <li>It's length should be less than 12 characters.</li>
            <li>It must contain a Uppercase letter.</li>
            <li>It must contain a Lowercase letter.</li>
            <li>It must contain a number.</li>
            <li>It must contain a special character.</li>
        </ul>
    `;

    const usernameTooltipContent = `
        <ul>
            <li>Its length should be atleast of 5 characters.</li>
            <li>It's length should be less than 20 characters.</li>
            <li>It should not contain any special character.</li>
            <li>It can contain underscore.</li>
        </ul>
    `

    const isFormComplete = !formData.username || !formData.email || !formData.password || loading;

    const handleOnClick = () => {

        setLoading(true);

        if(!usernameCheck) {
            toast.error("Please first correct the username according to the required condition !!");
            setLoading(false);
            return;
        } else if(!emailCheck) {
            toast.error("Please first correct the email according to the required condition !!");
            setLoading(false);
            return;
        } else if(!passwordCheck) {
            toast.error("Please first correct the password according to the required condition !!");
            setLoading(false);
            return;
        }

        const result = signUpValidation.safeParse(formData);

        axios.post(`${authUrl}/users/register`, result.data, {
            headers: {"Content-Type": "application/json"},
            withCredentials: true
        })
        .then(() => {
            setLoading(false);
            toast.success("registered successfully !")
            navigate(`/login`)
        })
        .catch((err) => {
            console.log("something went wrong while registering the user : ", err.response.data)
            toast.error("Something went wrong while registering you !!")
            setLoading(false);
        })
    }

    const inputUsernameValidation = () => {
        setUsernameCheck(false);

        const result = usernameValidation.safeParse(formData.username);

        if(!result.success) {
            toast.error(result.error._zod.def[0].message)
            return;
        }

        setUsernameCheck(true);
    }

    const inputEmailValidation = () => {
        setEmailCheck(false);

        const result = emailValidation.safeParse(formData.email);

        if(!result.success) {
            toast.error(result.error._zod.def[0].message)
            return;
        }

        setEmailCheck(true);
    }

    const inputPasswordValidation = () => {
        setPasswordCheck(false);

        const result = passwordValidation.safeParse(formData.password);

        if(!result.success) {
            toast.error(result.error._zod.def[0].message)
            return;
        }

        setPasswordCheck(true);
    }

    return (
        <div
        className="flex justify-center items-center"
        >
            <div
            className="flex flex-col border rounded-4xl bg-cyan-400 p-4 m-4 w-[40%]"
            >

                {/* heading */}

                <h1
                className="text-3xl font-bold text-center p-4 m-4"
                >
                    SignUp Form

                    <p className="text-sm font-light">Already have an account ? <Link className="text-blue-800 underline decoration-sky-500" to="/login">Login</Link></p>
                </h1>


                {/* username */}

                <Tooltip 
                id="username-tooltip"
                />

                <label 
                htmlFor="usernameInput"
                className="ml-4 font-bold"
                >
                    Username : <span data-tooltip-id="username-tooltip" data-tooltip-html={usernameTooltipContent}><FontAwesomeIcon icon={faInfoCircle} size="sm" /></span>
                </label>

                <input 
                name="username"
                id="usernameInput"
                type="text" 
                placeholder="Enter your username ..."
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                value={formData.username}
                onBlur={inputUsernameValidation}
                className="border rounded-4xl bg-white p-4 m-4"
                />


                {/* email */}

                <label 
                htmlFor="emailInput"
                className="ml-4 font-bold"
                >
                    Email : 
                </label>

                <input 
                name="email"
                id="emailInput"
                type="text" 
                placeholder="Enter your email ..."
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                value={formData.email}
                onBlur={inputEmailValidation}
                className="border rounded-4xl bg-white p-4 m-4"
                />


                {/* password */}

                <Tooltip 
                id="password-tooltip"
                />

                <label 
                htmlFor="passwordInput"
                className="ml-4 font-bold"
                >
                    Password : <span data-tooltip-id="password-tooltip" data-tooltip-html={passwordTooltipContent}><FontAwesomeIcon icon={faInfoCircle} size="sm" /></span>
                </label>

                <input 
                name="password"
                id="passwordInput"
                type="password" 
                placeholder="Enter your password ..."
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                value={formData.password}
                onBlur={inputPasswordValidation}
                className="border rounded-4xl bg-white p-4 m-4"
                />


                {/* button */}

                <button
                className="border rounded-4xl p-4 m-4 cursor-pointer bg-green-400 disabled:cursor-not-allowed disabled:bg-green-300"
                onClick={handleOnClick}
                disabled={isFormComplete} 
                >
                    {loading ? "signing you in ..." : "Sign Up"}
                </button>
            </div>
        </div>
    )
}

export default Signup;