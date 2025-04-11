import React, { useCallback, useEffect, useState } from "react";
import "../css/transaction-history.css";




const History = ({ user, fetchSummary }) => {
    const [transactions, setTransactions] = useState([]);

    const fetchAllTransactions = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/getTransaction/${user.Id}`);
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
            setTransactions(sortedData);
        } catch (err) {
            console.error("Error fetching history:", err);
        }
    }, [user?.Id]);

    useEffect(() => {
        console.log("User ID:", user?.Id);
        if (user?.Id) fetchAllTransactions();
    }, [user?.Id, fetchAllTransactions]);

    return (
        <div className="history-container">
            <h2>All Expenses</h2>
            {transactions.length > 0 ? (
                <ul className="history-list">
                    {transactions.map((txn, idx) => (
                        <li key={idx} className="history-card">
                            <p><strong>{txn.PayerName}</strong> paid <strong>₹{txn.Amount}</strong> on Behalf of <strong>{txn.RecipientName}</strong></p>
                            <p className="txn-desc">For: {txn.Description}</p>
                            <p className="txn-date">{new Date(txn.CreatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                            <div className="owed-info-history">
                                <div><strong>{txn.RecipientName === user.Name ? "You" : txn.RecipientName} {txn.RecipientName === user.Name ? "owe" : "owes"}:</strong> ₹{txn.Amount / 2}</div>
                                <div>
                                    <strong
                                        style={{
                                            color: txn.IsSettled ? "#3c763d" : "#a94442", 
                                            backgroundColor: txn.IsSettled ? "#dff0d8" : "#f2dede", 
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            display: "inline-block"
                                        }}
                                    >
                                        {txn.IsSettled ? "Bill settled!" : "Bill not settled!"}
                                    </strong>
                                </div>                            
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No transactions yet!</p>
            )}
        </div>
    );
};

export default History;
