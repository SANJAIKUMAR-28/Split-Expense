import React, { useEffect, useState } from "react";
import "../css/friend-card.css";
import { formatISTDate } from "../utils/formatTime";

const FriendsCrad = ({ friends }) => {
    const getBgColor = (value) => {
        const colors = [
            "#1abc9c", "#3498db", "#9b59b6", "#e74c3c", "#e67e22", "#2ecc71", "#34495e", "#d35400",
        ];
        return colors[value];
    };

    const [friendsTxn, setFriendsTxn] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFriendName, setSelectedFriendName] = useState("");

    useEffect(() => {
        console.log(friendsTxn);
    }, [friendsTxn]);

    const handleCardClick = (friend) => {
        setFriendsTxn(friend.transactions);
        setSelectedFriendName(friend.name);
        setShowModal(true);
    };

    if (!friends || friends.length === 0) {
        return (
            <p style={{ color: "grey" }}>No transaction made with friends yet!</p>
        );
    }

    return (
        <>
            <div className="grid-container">
                {friends.map((friend) => (
                    <div onClick={() => handleCardClick(friend)} key={friend.mobile} className="box">
                        <div className="user-header">
                            <div className="box-avatar" style={{ backgroundColor: getBgColor(friend.name.charCodeAt(0) % 8), color: "#fff" }}>
                                {friend.name.charAt(0)}
                            </div>
                            <div className="user-details">
                                <p><strong>Name: </strong>{friend.name.toUpperCase()}</p>
                                <p><strong>Mobile: </strong>{friend.mobile}</p>
                                <p><strong>Total Transactions: </strong>{friend.totalTransactions}</p>
                            </div>
                        </div>
                        <div className="user-amount-details">
                            <div className="user-amount">
                                <p><strong>Total Expenses</strong></p>
                                <p>₹{friend.totalAmount}</p>
                            </div>
                            <div className="user-amount">
                                <p><strong>You Owe</strong></p>
                                <p style={{ color: "red" }}>₹{friend.youOwe}</p>
                            </div>
                            <div className="user-amount">
                                <p><strong>{friend.name.toUpperCase()} Owe</strong></p>
                                <p style={{ color: "green" }}>₹{friend.youAreOwed}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: "10px" }}>Transactions with {selectedFriendName.toUpperCase()}</h3>
                        <div className="modal-scroll">
                            {friendsTxn.length > 0 ? (
                                friendsTxn.map((txn, idx) => (
                                    <div key={idx} className="txn-card">
                                        <div style={{display:"flex",justifyContent:"space-between"}}>
                                        <p><strong>Description:</strong> {txn.reason}</p>
                                        <p style={{color: txn.payer ? "#3c763d" : "#a94442", 
                                            backgroundColor: txn.payer ? "#dff0d8" : "#f2dede",
                                            padding: "2px 4px",
                                            borderRadius: "4px",
                                             }}>{txn.payer?"Payer":"Recipient"}</p>
                                        </div>
                                        <p><strong>Amount:</strong> ₹{txn.amount}</p>
                                        <p><strong>Date:</strong> {formatISTDate(txn.date)}</p>
                                        <p><strong>Status:</strong> {txn.IsSettled?"Bill settled!":"Bill not settled!"}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No transactions yet.</p>
                            )}
                        </div>
                        <button className="back-btn" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FriendsCrad;
