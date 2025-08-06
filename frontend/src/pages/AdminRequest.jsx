import { authUrl } from "@/config/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminRequest() {

    const [allFetchedRequests, setAllFetchedRequests] = useState([]);
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);

    const allRequests = () => {
        axios.get(`${authUrl}/admin/allRequests`, {
            withCredentials: true
        })
        .then((res) => {
            setAllFetchedRequests(res.data.data)
        })
        .catch((err) => {
            console.log("Something went wrong while fetching all the requests : ", err)
            toast.error("Something went wrong while fetching all the requests !!")
        })
    }

    const approveRequest = (email, userId) => {

        setApproveLoading(true)

        axios.post(`${authUrl}/admin/approveRequest`, {
            desiredEmail: email,
            userId
        }, {
            withCredentials: true
        })
        .then(() => {
            toast.success("request approved !!")
            setApproveLoading(false);
            allRequests();
        })
        .catch((err) => {
            console.log("Something went wrong while approving the request : ", err)
            toast.error("Something went wrong while approving the request !!")
            setApproveLoading(false);
        })
    }

    const rejectRequest = (email) => {

        setRejectLoading(true)

        axios.post(`${authUrl}/admin/rejectRequest`, {
            desiredEmail: email,
        }, {
            withCredentials: true
        })
        .then(() => {
            toast.success("request rejected !!")
            setRejectLoading(false);
            allRequests();
        })
        .catch((err) => {
            console.log("Something went wrong while rejecting the request : ", err)
            toast.error("Something went wrong while rejecting the request !!")
            setRejectLoading(false);
        })
    }

    useEffect(() => {
        allRequests();
    }, [])

    return (
        <div>
            <div 
            className="p-4 m-4"
            >
                {allFetchedRequests.length === 0 
                ? (<p className="text-white text-4xl font-bold">No pending requests.</p>) 
                : (
                        <table className="min-w-full bg-blue-300 shadow rounded-xl">
                            <thead>
                                <tr className="bg-blue-400 text-left">
                                    <th className="p-2">Email to be updated</th>
                                    <th className="p-2">Requested By</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {allFetchedRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="p-2">{request.email}</td>
                                        <td className="p-2">{request.requestedByName}</td>

                                        <button
                                        className="p-2 m-2 cursor-pointer bg-green-500 text-white rounded disabled:cursor-not-allowed disabled:bg-green-400"
                                        onClick={() => approveRequest(request.email, request.requestedById)}
                                        disabled={approveLoading}
                                        >
                                            {approveLoading ? "approving ..." : "approve"}
                                        </button>

                                        <button
                                        className="p-2 m-2 cursor-pointer bg-red-500 text-white rounded disabled:cursor-not-allowed disabled:bg-red-400"
                                        onClick={() => rejectRequest(request.email)}
                                        disabled={rejectLoading}
                                        >
                                            {approveLoading ? "rejecting ..." : "reject"}
                                        </button>
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