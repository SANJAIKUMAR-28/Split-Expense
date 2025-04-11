import React from "react";

const Modal = ({ amount, description, user, recipientMobile, setAmount, setDescription, setRecipientMobile, handleSubmit, onClose }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Add Bill</h2>
                <label className="modal-label">Amount</label>
                <input
                    type="number"
                    value={amount}
                    placeholder="Enter total expense"
                    onChange={(e) => setAmount(e.target.value)}
                    className="modal-input"
                />

                <label className="modal-label">Description</label>
                <input
                    type="text"
                    value={description}
                    placeholder="Enter description"
                    onChange={(e) => setDescription(e.target.value)}
                    className="modal-input"
                />

                <label className="modal-label">Payer Mobile (You)</label>
                <input
                    type="text"
                    value={user?.Mobile || ""}
                    readOnly
                    className="modal-input readonly-input"
                />

                <label className="modal-label">Recipient Mobile</label>
                <input
                    type="text"
                    value={recipientMobile}
                    placeholder="Enter recipient mobile no."
                    onChange={(e) => setRecipientMobile(e.target.value)}
                    className="modal-input"
                />

                <button className="modal-submit" onClick={handleSubmit}>Submit</button>
                <button className="modal-close" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
