import React from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

function SummaryModal({ show, onHide, data }) {
    console.log("summary", data);

    // Prepare summary for each company
    const companySummaries = data.map(company => {
        const totalBilling = company.data.reduce((sum, item) => sum + (Number(item.amount_billing) || 0), 0);
        const totalPaid = company.data.reduce((sum, item) => sum + (Number(item.amount_paid) || 0), 0);
        return {
            name: company.insurance_company_name,
            totalBilling,
            totalPaid
        };
    });

    return (
        <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Summary
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Insurance Company</th>
                            <th>Billing Amount Total</th>
                            <th>Difference Amount Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companySummaries.map((company, index) => (
                            <tr key={index}>
                                <td>{company.name}</td>
                                <td>{company.totalBilling.toFixed(2)}</td>
                                <td>{company.totalPaid.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
}

export default SummaryModal;
