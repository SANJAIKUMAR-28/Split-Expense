import React, { useCallback, useEffect, useState } from "react";
import "../css/transaction-history.css";
import { DownloadPDF } from "../utils/pdfConverter";
import SettleModal from "./SettleModal";
import { toast } from "react-toastify";
import BellWithTooltip from "./BellWithTooltip";


const Transactions = ({ user, fetchSummary }) => {
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [transaction, setTransaction] = useState([])


    const fetchAllTransactions = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/getTransaction/${user.Id}`);
            const data = await response.json();
            const unsettledData = data.filter(txn => txn.IsSettled === false);
            const sortedData = unsettledData.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));

            setTransactions(sortedData);
        } catch (err) {
            console.error("Error fetching history:", err);
        }
    }, [user?.Id]);

    useEffect(() => {
        console.log("User ID:", user?.Id);
        if (user?.Id) fetchAllTransactions();
    }, [user?.Id, fetchAllTransactions]);

    const handleCardClick = (txn) => {
        if (!txn.IsSettled && txn.RecipientId === user.Id) {
            setTransaction(txn)
            setShowModal(true)
        }
    }

    const handleSettle = async (txn) => {
        try {
            const response = await fetch(`http://localhost:8080/updateTransaction/${txn.Id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Something went wrong");
                return;
            }
            toast.success("Bill Settled Successfully!");
            setShowModal(false)
            await fetchAllTransactions();
            await fetchSummary();
        } catch (err) {
            console.error("Bill Settling failed:", err);
            toast.warn("Failed to Settle Bill. Try again!");
        }


        console.log(txn)
    }



    return (
        <div className="history-container">
            <h2>All Transactions</h2>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="pdf-button" onClick={() => DownloadPDF({ user: user, transactions: transactions })}>
                    Download as PDF
                </button>
            </div>
            {transactions.length > 0 ? (
                <ul className="history-list">
                    {transactions.map((txn, idx) => (
                        <li onClick={() => handleCardClick(txn)} key={idx} className="history-card">
                            <div className="txn-name">
                                <p><strong>{txn.PayerName}</strong> paid <strong>₹{txn.Amount}</strong> on Behalf of <strong>{txn.RecipientName}</strong></p>
                                {!(user.Mobile===txn.RecipientMobile) && (<BellWithTooltip number={txn.RecipientMobile} payer={txn.PayerName} amount={txn.Amount/2} desc={txn.Description}/>)}
                            </div>
                            <p className="txn-desc">For: {txn.Description}</p>
                            <p className="txn-date">{new Date(txn.CreatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                            <div className="owed-info">
                                <div><strong>{txn.RecipientName === user.Name ? "You" : txn.RecipientName} {txn.RecipientName === user.Name ? "owe" : "owes"}:</strong> ₹{txn.Amount / 2}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No transactions pending!</p>
            )}
            {showModal && (
                <SettleModal txn={transaction} setShowModal={setShowModal} handleSettle={handleSettle} />
            )}
        </div>
    );
};

export default Transactions;
