import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-toastify";
import { faClockRotateLeft, faUserGroup, faArrowRightFromBracket, faReceipt, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import Modal from "../components/Modal";
import DashboardHistory from "../components/DashboardHistory";
import Transactions from "../components/Transactions";
import History from "../components/History";
import logo from '../assets/logo.png';


import "../css/dashboard.css";
const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = location.state || {};
    const [activeTab, setActiveTab] = useState("dashboard");

    const [expense, setExpense] = useState("");
    const [owe, setOwe] = useState("");
    const [owed, setOwed] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [amount, setAmount] = useState();
    const [description, setDescription] = useState("");
    const [recipientMobile, setRecipientMobile] = useState("");

    const [youOweList, setYouOweList] = useState([]);
    const [youAreOwedList, setYouAreOwedList] = useState([]);

    const fetchTransaction = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/getTransaction/${user.Id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            const oweMap = new Map();
            const owedMap = new Map();

            data.forEach((txn) => {
                const {
                    Amount,
                    Description,
                    PayerId,
                    PayerName,
                    PayerMobile,
                    RecipientId,
                    RecipientName,
                    RecipientMobile,
                    CreatedAt,
                    IsSettled
                } = txn;

                if (user.Id === PayerId && !IsSettled) {
                    if (!owedMap.has(RecipientName)) {
                        owedMap.set(RecipientName, {
                            name: RecipientName,
                            mobile: RecipientMobile,
                            totalAmount: 0,
                            transactions: [],
                        });
                    }
                    const person = owedMap.get(RecipientName);
                    person.totalAmount += Amount / 2;
                    person.transactions.push({ amount: Amount / 2, reason: Description, date: CreatedAt });
                } else if (user.Id === RecipientId && !IsSettled) {
                    if (!oweMap.has(PayerName)) {
                        oweMap.set(PayerName, {
                            name: PayerName,
                            mobile: PayerMobile,
                            totalAmount: 0,
                            transactions: [],
                        });
                    }
                    const person = oweMap.get(PayerName);
                    person.totalAmount += Amount / 2;
                    person.transactions.push({ amount: Amount / 2, reason: Description, date: CreatedAt });
                }
            });

            setYouOweList(Array.from(oweMap.values()));
            setYouAreOwedList(Array.from(owedMap.values()));
        } catch (err) {
            console.error("Error fetching transaction:", err);
        }
    }, [user?.Id]);


    useEffect(() => {
        if (!user) {
            setTimeout(() => navigate("/"), 3000);
        }
    }, [user, navigate]);


    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/getDetails/${user.Id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            setExpense(data?.TotalExpense ?? "1");
            setOwe(data?.Owe ?? "1");
            setOwed(data?.Owed ?? "1");
        } catch (err) {
            console.error("Error fetching summary:", err);
        }
    }, [user?.Id]);

    useEffect(() => {
        if (user?.Id) {
            fetchSummary();
            fetchTransaction();
        }
    }, [user?.Id, fetchSummary, fetchTransaction, activeTab]);

    const handleBillSubmit = async () => {
        const billData = {
            amount: parseFloat(amount),
            description: description,
            payer_mobile: user.Mobile,
            recipient_mobile: recipientMobile,
        };

        try {
            const response = await fetch("http://localhost:8080/bills", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(billData),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Something went wrong");
                return;
            }
            toast.success("Bill created successfully!");
            await fetchSummary();
            await fetchTransaction();
        } catch (err) {
            console.error("Billing failed:", err);
            toast.warn("Failed to create Bill. Try again!");
        }

        setAmount("");
        setDescription("");
        setRecipientMobile("");
        setShowModal(false);
    };

    if (!user) {
        return (
            <div className="dashboard">
                <h2>⚠️ Sign-in Required</h2>
                <p>You must be signed in to view this page.</p>
                <button className="back-btn" onClick={() => navigate("/")}>
                    Go back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="main-container">
            <div className="sidebar">
                <ul>
                    <li className="sidebar-logo">
                        <img src={logo} alt="logo" />
                    </li>
                    <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => { setActiveTab("dashboard") }}><FontAwesomeIcon icon={faChartSimple} style={{marginRight:"8px",fontSize:"15px"}} /> Dashboard</li>
                    <li className={activeTab === "transactions" ? "active" : ""} onClick={() => { setActiveTab("transactions") }}><FontAwesomeIcon icon={faReceipt} style={{marginRight:"8px",fontSize:"15px"}} /> Transactions</li>
                    <li className={activeTab === "history" ? "active" : ""} onClick={() => { setActiveTab("history") }}><FontAwesomeIcon icon={faClockRotateLeft} style={{marginRight:"8px",fontSize:"15px"}} /> History</li>
                    <li className={activeTab === "friends" ? "active" : ""} onClick={() => { setActiveTab("friends") }}><FontAwesomeIcon icon={faUserGroup} style={{marginRight:"8px",fontSize:"15px"}} />Friends</li>
                    <li className={activeTab === "logout" ? "active" : ""} onClick={() => { setTimeout(() => navigate("/"), 1000); }}><FontAwesomeIcon icon={faArrowRightFromBracket} style={{marginRight:"8px",fontSize:"15px"}} /> Logout</li>
                </ul>
            </div>
            <div className="dashboard">
                <div className="dashboard-head">
                    <h1>Welcome, {user.Name}!</h1>
                    <div className="dashboard-buttons">
                        <button onClick={() => setShowModal(true)}>Add a Bill</button>
                    </div>
                </div>

                <hr className="separator" />

                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <h3>Total Expenses</h3>
                        <p>₹ {expense}</p>
                    </div>
                    <div className="vertical-line"></div>
                    <div className="dashboard-card">
                        <h3>You Owe</h3>
                        <p style={{ color: "red" }}>₹ {owe}</p>
                    </div>
                    <div className="vertical-line"></div>
                    <div className="dashboard-card">
                        <h3>You Are Owed</h3>
                        <p style={{ color: "green" }}>₹ {owed}</p>
                    </div>
                </div>

                <hr className="separator" />

                {activeTab === "dashboard" && (
                    <DashboardHistory youOweList={youOweList} youAreOwedList={youAreOwedList} />
                )}

                {activeTab === "transactions" && <Transactions user={user} fetchSummary={fetchSummary} />}

                {activeTab === "history" && <History user={user} />}


                {showModal && (
                    <Modal
                        amount={amount}
                        description={description}
                        recipientMobile={recipientMobile}
                        setAmount={setAmount}
                        setDescription={setDescription}
                        setRecipientMobile={setRecipientMobile}
                        handleSubmit={handleBillSubmit}
                        user={user}
                        onClose={() => setShowModal(false)}
                    />
                )}

            </div>
        </div>
    );
};

export default Dashboard;
