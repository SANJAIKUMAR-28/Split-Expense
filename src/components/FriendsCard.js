import React from "react";
import "../css/friend-card.css";

const FriendsCrad = ({ friends }) => {
    const getBgColor = (value) => {
        const colors = [
            "#1abc9c", "#3498db", "#9b59b6", "#e74c3c", "#e67e22", "#2ecc71", "#34495e", "#d35400",
        ];
        return colors[value];
    };

    return (
        <div className="grid-container">
            {friends.map((friend) => (
                <div key={friend.mobile} className="box">
                    <div className="user-header">
                        <div className="box-avatar" style={{ backgroundColor: getBgColor(friend.name.charCodeAt(0)%8), color: "#fff" }}>{friend.name.charAt(0)}</div>
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
    );
};

export default FriendsCrad;
