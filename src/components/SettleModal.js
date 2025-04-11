import React from "react";

const SettleModal = ({ txn, setShowModal, handleSettle }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Settle Bill</h2>

                <label className="modal-label">Amount</label>
                <input
                    type="number"
                    value={txn?.Amount/2 ?? ""}
                    className="modal-input readonly-input"
                    readOnly
                />

                <label className="modal-label">Description</label>
                <input
                    type="text"
                    value={txn?.Description ?? ""}
                    className="modal-input readonly-input"
                    readOnly
                />

                <label className="modal-label">Payer Mobile</label>
                <input
                    type="text"
                    value={txn?.PayerMobile ?? ""}
                    className="modal-input readonly-input"
                    readOnly
                />

                <button className="modal-submit" onClick={() => handleSettle(txn)}>
                    Settle
                </button>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default SettleModal;
