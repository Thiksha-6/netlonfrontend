import React, { useState, useRef } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";

const QuotationPage = () => {
  const printRef = useRef(); // For printing

  // ================= COMPANY INFO =================
  const companyInfo = {
    name: "SRI RAJA MOSQUITO NETLON SERVICES",
    description: "Manufacture & Dealer in Mosquito & Insect Net (WholeSale & Retail)",
    phone: "+91 9363401212",
    gstin: "33BECPR927M1ZU",
    address: "Ryan Complex Vadavalli Road, Edayarpalayam, Coimbatore-25",
  };

  // ================= STATE =================
  const [billInfo, setBillInfo] = useState({
    billTo: "",
    stateName: "",
    contactNo: "",
    gstin: "",
    estimateNo: "",
    estimateDate: "",
    branch: "",
  });

  const [items, setItems] = useState([{ description: "", qty: 0, rate: 0, amount: 0 }]);

  const [quotations, setQuotations] = useState([]); // All saved quotations
  const [selectedIndex, setSelectedIndex] = useState(null); // For edit

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  // ================= HANDLERS =================
  const handleBillChange = (e) => {
    setBillInfo({ ...billInfo, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "description" ? value : Number(value);
    newItems[index].amount = newItems[index].qty * newItems[index].rate;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: "", qty: 0, rate: 0, amount: 0 }]);
  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);
  const cgst = totalAmount * 0.09;
  const sgst = totalAmount * 0.09;
  const grandTotal = totalAmount + cgst + sgst;

  const bankInfo = {
    accountHolder: "RAJASEKAR P",
    accountNumber: "50100774198590",
    ifsc: "HDFC0006806",
    branch: "EDAYARPALAYAM",
    accountType: "SAVING",
  };

  // ================= SAVE QUOTATION =================
  const handleSave = () => {
    const quotationData = { billInfo, items: [...items], totals: { totalAmount, cgst, sgst, grandTotal } };

    if (isEditing && selectedIndex !== null) {
      const updated = [...quotations];
      updated[selectedIndex] = quotationData;
      setQuotations(updated);
      setIsEditing(false);
      setSelectedIndex(null);
    } else {
      setQuotations([...quotations, quotationData]);
    }

    alert("Quotation saved successfully!");
    setShowModal(false);
    setBillInfo({ billTo: "", stateName: "", contactNo: "", gstin: "", estimateNo: "", estimateDate: "", branch: "" });
    setItems([{ description: "", qty: 0, rate: 0, amount: 0 }]);
  };

  // ================= PRINT =================
  const handlePrint = (index) => {
    const quotation = quotations[index];
    const printContents = `
      <div>
        <h3>${companyInfo.name}</h3>
        <p>${companyInfo.description}</p>
        <p>Phone: ${companyInfo.phone} | GSTIN: ${companyInfo.gstin}</p>
        <p>${companyInfo.address}</p>
        <hr/>
        <p><strong>Bill To:</strong> ${quotation.billInfo.billTo} | <strong>State:</strong> ${quotation.billInfo.stateName} | <strong>Contact:</strong> ${quotation.billInfo.contactNo} | <strong>GSTIN:</strong> ${quotation.billInfo.gstin} | <strong>Estimate No:</strong> ${quotation.billInfo.estimateNo} | <strong>Date:</strong> ${quotation.billInfo.estimateDate} | <strong>Branch:</strong> ${quotation.billInfo.branch}</p>
        <table border="1" style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th>S.No</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${quotation.items.map((item, i) => `<tr><td>${i+1}</td><td>${item.description}</td><td>${item.qty}</td><td>${item.rate}</td><td>${item.amount}</td></tr>`).join('')}
          </tbody>
        </table>
        <p>Total Amount: ₹ ${quotation.totals.totalAmount.toFixed(2)}</p>
        <p>CGST (9%): ₹ ${quotation.totals.cgst.toFixed(2)}</p>
        <p>SGST (9%): ₹ ${quotation.totals.sgst.toFixed(2)}</p>
        <h4>Grand Total: ₹ ${quotation.totals.grandTotal.toFixed(2)}</h4>
        <hr/>
        <p>Account Holder: ${bankInfo.accountHolder}</p>
        <p>Account Number: ${bankInfo.accountNumber}</p>
        <p>IFSC: ${bankInfo.ifsc}</p>
        <p>Branch: ${bankInfo.branch}</p>
        <p>Account Type: ${bankInfo.accountType}</p>
      </div>
    `;
    const newWindow = window.open("", "", "width=900,height=600");
    newWindow.document.write(printContents);
    newWindow.document.close();
    newWindow.print();
  };

  // ================= EDIT QUOTATION =================
  const handleEdit = (index) => {
    const quotation = quotations[index];
    setBillInfo({ ...quotation.billInfo });
    setItems([...quotation.items]);
    setSelectedIndex(index);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div style={{ padding: "20px", marginTop: "80px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Button variant="success" onClick={() => { setShowModal(true); setIsEditing(false); setBillInfo({ billTo: "", stateName: "", contactNo: "", gstin: "", estimateNo: "", estimateDate: "", branch: "" }); setItems([{ description: "", qty: 0, rate: 0, amount: 0 }]); }} style={{ marginRight: "10px" }}>
          Add New Quotation
        </Button>
      </div>

      {quotations.length > 0 && (
        <Table bordered hover size="sm">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Customer</th>
              <th>Estimate No</th>
              <th>Date</th>
              <th>Branch</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{q.billInfo.billTo}</td>
                <td>{q.billInfo.estimateNo}</td>
                <td>{q.billInfo.estimateDate}</td>
                <td>{q.billInfo.branch}</td>
                <td>
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(i)} style={{ marginRight: "5px" }}>
                    Edit
                  </Button>
                  <Button variant="info" size="sm" onClick={() => handlePrint(i)}>
                    Print
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ================= BILL INFO MODAL ================= */}
      <Modal show={showModal} onHide={toggleModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Quotation" : "Add New Quotation"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Bill To</Form.Label>
              <Form.Control name="billTo" value={billInfo.billTo} onChange={handleBillChange} placeholder="Customer Name / ID" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>State Name</Form.Label>
              <Form.Control name="stateName" value={billInfo.stateName} onChange={handleBillChange} placeholder="State / Address" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Contact No</Form.Label>
              <Form.Control name="contactNo" value={billInfo.contactNo} onChange={handleBillChange} placeholder="Contact Number" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Customer GSTIN</Form.Label>
              <Form.Control name="gstin" value={billInfo.gstin} onChange={handleBillChange} placeholder="GSTIN" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Estimate No</Form.Label>
              <Form.Control name="estimateNo" value={billInfo.estimateNo} onChange={handleBillChange} placeholder="Estimate No" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Estimate Date</Form.Label>
              <Form.Control type="date" name="estimateDate" value={billInfo.estimateDate} onChange={handleBillChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Branch</Form.Label>
              <Form.Control name="branch" value={billInfo.branch} onChange={handleBillChange} placeholder="Branch Name" />
            </Form.Group>

            <h5 style={{ marginTop: "15px" }}>Items</h5>
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <Form.Control value={item.description} onChange={(e) => handleItemChange(i, "description", e.target.value)} />
                    </td>
                    <td>
                      <Form.Control type="number" value={item.qty} onChange={(e) => handleItemChange(i, "qty", e.target.value)} />
                    </td>
                    <td>
                      <Form.Control type="number" value={item.rate} onChange={(e) => handleItemChange(i, "rate", e.target.value)} />
                    </td>
                    <td>{item.amount}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => removeItem(i)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="success" onClick={addItem} style={{ marginBottom: "10px" }}>
              Add Item
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Quotation
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuotationPage;
