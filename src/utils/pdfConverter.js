import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const DownloadPDF = ({user, transactions}) => {
    const doc = new jsPDF();
    doc.text("Transaction History", 14, 15);

    const tableColumn = ["Payer", "Recipient", "Amount", "Description", "Date"];
    const tableRows = [];

    transactions.forEach(txn => {
        const txnData = [
            txn.PayerName,
            txn.RecipientName,
            txn.Amount,
            txn.Description,
            new Date(txn.CreatedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
            }),
        ];
        tableRows.push(txnData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: "striped",
    });

    doc.save(`transaction-history-${user.Name}.pdf`);
};
