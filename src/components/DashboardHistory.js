import React from "react";
import "../css/dashboard-history.css";
import { formatISTDate } from "../utils/formatTime";

const DashboardHistory = ({ youOweList, youAreOwedList }) => {
  return (
    <div className="dashboard-history">
      <div className="transaction-column">
        <h2>YOU OWE</h2>
        {youOweList && youOweList.length > 0 ? (youOweList.map((user, idx) => (
          <div className="user-card" key={idx}>
            <div className="user-header">
              <div className="avatar">{user.name.charAt(0)}</div>
              <div className="user-info">
                <p className="user-name">{user.name.toUpperCase()} <span style={{fontWeight:"lighter",fontSize:"12px"}}>({user.mobile})</span></p>
                <p className="user-amount owed">You owe ₹{user.totalAmount}</p>
              </div>
            </div>
            <ul className="transaction-list">
              {user.transactions.map((t, i) => (
                <li key={i}>₹{t.amount} for "{t.reason}" on {formatISTDate(t.date)}</li>
              ))}
            </ul>
          </div>
        ))):(<p style={{textAlign:"center", marginTop:"20px",color:"grey"}}>You do not owe anything!</p>)}
      </div>

      <div className="vertical-divider"></div>

      <div className="transaction-column">
        <h2>YOU ARE OWED</h2>
        {youAreOwedList && youAreOwedList.length>0?(youAreOwedList.map((user, idx) => (
          <div className="user-card" key={idx}>
            <div className="user-header">
              <div className="avatar">{user.name.charAt(0)}</div>
              <div className="user-info">
                <p className="user-name">{user.name.toUpperCase()} <span style={{fontWeight:"lighter",fontSize:"12px"}}>({user.mobile})</span></p>
                <p className="user-amount owed-to-you">You are owed ₹{user.totalAmount}</p>
              </div>
            </div>
            <ul className="transaction-list">
              {user.transactions.map((t, i) => (
                <li key={i}>₹{t.amount} for "{t.reason}" on {formatISTDate(t.date)}</li>
              ))}
            </ul>
          </div>
        ))):(<p style={{textAlign:"center", marginTop:"20px",color:"grey"}}>You're all settled up!</p>)}
      </div>
    </div>
  );
};

export default DashboardHistory;
