import React, { useState } from "react";
import { Modal, Button, Form, Table, Container, Row, Col, Card } from "react-bootstrap";
import { Printer, Download, MessageCircle, FileText, PlusCircle, Trash2, Edit } from "lucide-react";
import logo from "./logo.png";

const InvoicePage = () => {
  // ================= COMPANY INFO =================
  const companyInfo = {
    name: "SRI RAJA MOSQUITO NETLON SERVICES",
    description: "Manufacture & Dealer in Mosquito & Insect Net (WholeSale & Retail)",
    phone: "+91 9363401212",
    gstin: "33BECPR927M1ZU",
    address: "Ryan Complex Vadavalli Road, Edayarpalayam, Coimbatore-25",
    branch: "Edayarpalayam",
  };

  // ================= STATE =================
  const [billInfo, setBillInfo] = useState({
    billTo: "",
    stateName: "",
    contactNo: "",
    gstin: "",
    estimateNo: "",
    estimateDate: new Date().toISOString().split('T')[0],
  });

  const [items, setItems] = useState([
    { description: "", qty: 0, rate: 0, amount: 0 }
  ]);
  
  const [invoices, setInvoices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ================= CALCULATIONS =================
  const totalAmount = items.reduce((a, b) => a + b.amount, 0);
  const cgst = totalAmount * 0.09;
  const sgst = totalAmount * 0.09;
  const grandTotal = totalAmount + cgst + sgst;

  const bankInfo = {
    holder: "RAJASEKAR P",
    accNo: "50100774198590",
    ifsc: "HDFC0006806",
    branch: "EDAYARPALAYAM",
    type: "SAVING",
  };

  // ================= HANDLERS =================
  const handleBillChange = (e) =>
    setBillInfo({ ...billInfo, [e.target.name]: e.target.value });

  const handleItemChange = (i, field, value) => {
    const data = [...items];
    data[i][field] = field === "description" ? value : Number(value);
    // Auto-calculate amount
    if (field === "qty" || field === "rate") {
      data[i].amount = data[i].qty * data[i].rate;
    }
    setItems(data);
  };

  const addItem = () =>
    setItems([...items, { description: "", qty: 0, rate: 0, amount: 0 }]);

  const removeItem = (i) => {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== i));
    }
  };

  // ================= SAVE =================
  const handleSave = () => {
    const data = {
      id: Date.now(),
      billInfo: { ...billInfo },
      items: [...items],
      totals: { totalAmount, cgst, sgst, grandTotal },
      date: new Date().toISOString(),
      // Auto-generate invoice number and date
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
    };

    if (editIndex !== null) {
      const updated = [...invoices];
      updated[editIndex] = data;
      setInvoices(updated);
      setEditIndex(null);
    } else {
      setInvoices([data, ...invoices]);
    }

    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setBillInfo({
      billTo: "",
      stateName: "",
      contactNo: "",
      gstin: "",
      estimateNo: "",
      estimateDate: new Date().toISOString().split('T')[0],
    });
    setItems([{ description: "", qty: 0, rate: 0, amount: 0 }]);
  };

  // ================= DOWNLOAD AS HTML =================
  const handleDownload = (inv) => {
    const html = generateInvoiceHTML(inv);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${inv.invoiceNo}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ================= PRINT =================
  const handlePrint = (inv) => {
    const html = generateInvoiceHTML(inv);
    const printWindow = window.open('', '', 'width=800,height=900');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const generateInvoiceHTML = (inv) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${inv.invoiceNo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
    .invoice-container { max-width: 800px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
    .company-header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #000; }
    .company-header h2 { color: #2c3e50; margin-bottom: 5px; font-size: 24px; }
    .invoice-title { text-align: center; margin: 25px 0; padding: 10px; background: #f8f9fa; border-top: 2px solid #000; border-bottom: 2px solid #000; font-size: 22px; font-weight: bold; }
    .details-section { display: flex; justify-content: space-between; margin-bottom: 25px; padding: 15px; background: #f8f9fa; border: 1px solid #ddd; }
    .bill-to, .invoice-details { width: 48%; }
    .items-table { width: 100%; border-collapse: collapse; margin: 25px 0; }
    .items-table th { background: #2c3e50; color: white; padding: 12px; text-align: left; border: 1px solid #000; }
    .items-table td { padding: 10px; border: 1px solid #000; }
    .items-table tr:nth-child(even) { background: #f8f9fa; }
    .totals-section { margin-top: 30px; padding-top: 20px; border-top: 2px solid #000; }
    .total-row { display: flex; justify-content: flex-end; margin-bottom: 10px; }
    .total-label { width: 150px; font-weight: bold; }
    .total-value { width: 150px; text-align: right; font-weight: bold; }
    .grand-total { font-size: 20px; color: #e74c3c; margin-top: 15px; padding-top: 15px; border-top: 2px solid #000; }
    .bank-details { margin-top: 40px; padding: 20px; background: #f8f9fa; border: 1px solid #000; border-radius: 5px; }
    .highlight { color: #e74c3c; font-weight: bold; }
    @media print { body { padding: 0; } .invoice-container { border: none; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="company-header">
      <h2>${companyInfo.name}</h2>
      <p>${companyInfo.description}</p>
      <p class="highlight">${companyInfo.phone} | GST IN: ${companyInfo.gstin}</p>
      <p>${companyInfo.address}</p>
    </div>
    <div class="invoice-title">INVOICE BILL</div>
    <div class="details-section">
      <div class="bill-to">
        <h4>Bill To</h4>
        <p><strong>Name:</strong> ${inv.billInfo.billTo}</p>
        <p><strong>State:</strong> ${inv.billInfo.stateName}</p>
        <p><strong>Contact:</strong> ${inv.billInfo.contactNo}</p>
        <p><strong>GSTIN:</strong> ${inv.billInfo.gstin}</p>
      </div>
      <div class="invoice-details">
        <h4>Invoice Details</h4>
        <p><strong>Invoice No:</strong> ${inv.invoiceNo}</p>
        <p><strong>Estimate No:</strong> ${inv.billInfo.estimateNo}</p>
        <p><strong>Date:</strong> ${inv.invoiceDate}</p>
        <p><strong>Estimate Date:</strong> ${inv.billInfo.estimateDate}</p>
        <p><strong>Branch:</strong> ${companyInfo.branch}</p>
      </div>
    </div>
    <table class="items-table">
      <thead>
        <tr><th>Sl.No</th><th>Description</th><th>Qty</th><th>Rate (₹)</th><th>Amount (₹)</th></tr>
      </thead>
      <tbody>
        ${inv.items.map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.description}</td>
            <td>${item.qty}</td>
            <td>${item.rate.toFixed(2)}</td>
            <td>${item.amount.toFixed(2)}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <div class="totals-section">
      <div class="total-row"><div class="total-label">Sub Total:</div><div class="total-value">₹${inv.totals.totalAmount.toFixed(2)}</div></div>
      <div class="total-row"><div class="total-label">CGST (9%):</div><div class="total-value">₹${inv.totals.cgst.toFixed(2)}</div></div>
      <div class="total-row"><div class="total-label">SGST (9%):</div><div class="total-value">₹${inv.totals.sgst.toFixed(2)}</div></div>
      <div class="total-row grand-total"><div class="total-label">GRAND TOTAL:</div><div class="total-value">₹${inv.totals.grandTotal.toFixed(2)}</div></div>
    </div>
    <div class="bank-details">
      <h4>Bank Details</h4>
      <div>
        <p><strong>Account Holder:</strong> ${bankInfo.holder}</p>
        <p><strong>Account Number:</strong> ${bankInfo.accNo}</p>
        <p><strong>IFSC Code:</strong> ${bankInfo.ifsc}</p>
        <p><strong>Branch:</strong> ${bankInfo.branch}</p>
        <p><strong>Account Type:</strong> ${bankInfo.type}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  // ================= WHATSAPP =================
  const sendWhatsApp = (inv) => {
    const msg = `Invoice ${inv.invoiceNo}
Customer: ${inv.billInfo.billTo}
Total Amount: ₹${inv.totals.grandTotal.toFixed(2)}
Date: ${inv.invoiceDate}
Thank you for your business!`;
    
    window.open(`https://wa.me/91${inv.billInfo.contactNo}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ================= EDIT =================
  const handleEdit = (index) => {
    const inv = invoices[index];
    setBillInfo(inv.billInfo);
    setItems(inv.items);
    setEditIndex(index);
    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const updated = invoices.filter((_, i) => i !== index);
      setInvoices(updated);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4 style={{ color: "#2c3e50", margin: 0 }}>Invoice Management</h4>
            <p style={{ color: "#6c757d", margin: "5px 0 0 0", fontSize: "0.9rem" }}>
              Create and manage your invoices
            </p>
          </div>
          <Button 
            variant="success" 
            onClick={() => setShowModal(true)}
            style={{ padding: "8px 20px" }}
          >
            <PlusCircle size={18} className="me-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Invoices List */}
      {invoices.length > 0 ? (
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <div style={{ padding: "15px", borderBottom: "1px solid #e0e0e0", backgroundColor: "#f8f9fa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 style={{ color: "#2c3e50", margin: 0 }}>
                <FileText size={20} className="me-2" />
                Recent Invoices
              </h5>
              <span style={{ backgroundColor: "#6c757d", color: "white", padding: "3px 10px", borderRadius: "12px", fontSize: "0.85rem" }}>
                {invoices.length} invoices
              </span>
            </div>
          </div>
          <Table hover responsive style={{ margin: 0 }}>
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th style={{ padding: "12px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>#</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Invoice No</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Customer</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Date</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Total Amount</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={inv.id || i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px", color: "#6c757d" }}>{i + 1}</td>
                  <td style={{ padding: "12px" }}>
                    <strong style={{ color: "#2c3e50" }}>{inv.invoiceNo}</strong>
                    {inv.billInfo.estimateNo && (
                      <div style={{ color: "#6c757d", fontSize: "0.8rem", marginTop: "2px" }}>
                        Est: {inv.billInfo.estimateNo}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ color: "#2c3e50" }}>{inv.billInfo.billTo}</div>
                    {inv.billInfo.stateName && (
                      <div style={{ color: "#6c757d", fontSize: "0.85rem", marginTop: "2px" }}>
                        {inv.billInfo.stateName}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "12px", color: "#6c757d" }}>
                    {inv.invoiceDate}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <strong style={{ color: "#28a745", fontSize: "1.1rem" }}>
                      ₹{inv.totals.grandTotal.toFixed(2)}
                    </strong>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <Button 
                        size="sm" 
                        variant="outline-primary" 
                        onClick={() => handlePrint(inv)}
                        title="Print"
                        style={{ padding: "4px 8px", borderRadius: "4px" }}
                      >
                        <Printer size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-success" 
                        onClick={() => handleDownload(inv)}
                        title="Download"
                        style={{ padding: "4px 8px", borderRadius: "4px" }}
                      >
                        <Download size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-info" 
                        onClick={() => sendWhatsApp(inv)}
                        title="Send via WhatsApp"
                        style={{ padding: "4px 8px", borderRadius: "4px" }}
                      >
                        <MessageCircle size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-warning" 
                        onClick={() => handleEdit(i)}
                        title="Edit"
                        style={{ padding: "4px 8px", borderRadius: "4px" }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger" 
                        onClick={() => handleDelete(i)}
                        title="Delete"
                        style={{ padding: "4px 8px", borderRadius: "4px" }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px", 
          backgroundColor: "white", 
          borderRadius: "8px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)" 
        }}>
          <FileText size={60} style={{ color: "#dee2e6", marginBottom: "20px" }} />
          <h5 style={{ color: "#6c757d", marginBottom: "10px" }}>No invoices yet</h5>
          <p style={{ color: "#adb5bd", marginBottom: "20px" }}>
            Create your first invoice to get started
          </p>
          <Button 
            variant="success" 
            onClick={() => setShowModal(true)}
            style={{ padding: "8px 20px" }}
          >
            <PlusCircle size={18} className="me-2" />
            Create First Invoice
          </Button>
        </div>
      )}

      {/* Invoice Modal - Simplified */}
      <Modal 
        show={showModal} 
        onHide={() => {
          setShowModal(false);
          setEditIndex(null);
          resetForm();
        }}
        size="lg"
      >
        <Modal.Header closeButton style={{ borderBottom: "1px solid #e0e0e0" }}>
          <Modal.Title style={{ color: "#2c3e50", fontSize: "1.2rem" }}>
            {editIndex !== null ? "Edit Invoice" : "Create New Invoice"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <Form>
            {/* Customer Details Section */}
            <div style={{ marginBottom: "20px" }}>
              <h6 style={{ color: "#495057", marginBottom: "15px", paddingBottom: "8px", borderBottom: "2px solid #f0f0f0" }}>
                Customer Details
              </h6>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "0.9rem", fontWeight: "500", color: "#495057" }}>
                      Bill To <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="billTo"
                      value={billInfo.billTo}
                      onChange={handleBillChange}
                      placeholder="Customer name"
                      required
                      size="sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "0.9rem", fontWeight: "500", color: "#495057" }}>
                      Contact No <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="contactNo"
                      value={billInfo.contactNo}
                      onChange={handleBillChange}
                      placeholder="Phone number"
                      required
                      size="sm"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "0.9rem", fontWeight: "500", color: "#495057" }}>State Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="stateName"
                      value={billInfo.stateName}
                      onChange={handleBillChange}
                      placeholder="State"
                      size="sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "0.9rem", fontWeight: "500", color: "#495057" }}>GSTIN</Form.Label>
                    <Form.Control
                      type="text"
                      name="gstin"
                      value={billInfo.gstin}
                      onChange={handleBillChange}
                      placeholder="GST number"
                      size="sm"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "0.9rem", fontWeight: "500", color: "#495057" }}>Estimate No</Form.Label>
                    <Form.Control
                      type="text"
                      name="estimateNo"
                      value={billInfo.estimateNo}
                      onChange={handleBillChange}
                      placeholder="Estimate number"
                      size="sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "0.9rem", fontWeight: "500", color: "#495057" }}>Estimate Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="estimateDate"
                      value={billInfo.estimateDate}
                      onChange={handleBillChange}
                      size="sm"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Items Section */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h6 style={{ color: "#495057", margin: 0, paddingBottom: "8px", borderBottom: "2px solid #f0f0f0" }}>
                  Items
                </h6>
                <Button 
                  variant="outline-success" 
                  size="sm" 
                  onClick={addItem}
                  style={{ padding: "4px 12px", fontSize: "0.85rem" }}
                >
                  <PlusCircle size={14} className="me-1" />
                  Add Item
                </Button>
              </div>
              
              <Table bordered hover size="sm" style={{ marginBottom: "0" }}>
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                  <tr>
                    <th style={{ padding: "8px", fontSize: "0.85rem", color: "#495057", fontWeight: "600" }}>S.No</th>
                    <th style={{ padding: "8px", fontSize: "0.85rem", color: "#495057", fontWeight: "600" }}>Description</th>
                    <th style={{ padding: "8px", fontSize: "0.85rem", color: "#495057", fontWeight: "600" }}>Qty</th>
                    <th style={{ padding: "8px", fontSize: "0.85rem", color: "#495057", fontWeight: "600" }}>Rate</th>
                    <th style={{ padding: "8px", fontSize: "0.85rem", color: "#495057", fontWeight: "600" }}>Amount</th>
                    <th style={{ padding: "8px", fontSize: "0.85rem", color: "#495057", fontWeight: "600" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td style={{ padding: "8px", textAlign: "center", color: "#6c757d" }}>{i + 1}</td>
                      <td style={{ padding: "8px" }}>
                        <Form.Control
                          value={item.description}
                          onChange={(e) => handleItemChange(i, "description", e.target.value)}
                          size="sm"
                          placeholder="Description"
                        />
                      </td>
                      <td style={{ padding: "8px" }}>
                        <Form.Control
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleItemChange(i, "qty", e.target.value)}
                          size="sm"
                          placeholder="Qty"
                        />
                      </td>
                      <td style={{ padding: "8px" }}>
                        <Form.Control
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(i, "rate", e.target.value)}
                          size="sm"
                          placeholder="Rate"
                        />
                      </td>
                      <td style={{ padding: "8px", textAlign: "right", color: "#28a745", fontWeight: "600" }}>
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeItem(i)}
                          disabled={items.length <= 1}
                          style={{ padding: "2px 6px" }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Totals Preview */}
            <div style={{ 
              backgroundColor: "#f8f9fa", 
              padding: "15px", 
              borderRadius: "6px", 
              border: "1px solid #e9ecef",
              marginTop: "20px"
            }}>
              <Row>
                <Col md={8}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>Sub Total:</span>
                    <strong>₹{totalAmount.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>CGST (9%):</span>
                    <strong>₹{cgst.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>SGST (9%):</span>
                    <strong>₹{sgst.toFixed(2)}</strong>
                  </div>
                  <hr style={{ margin: "10px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h6 style={{ color: "#2c3e50", margin: 0, fontWeight: "600" }}>Grand Total:</h6>
                    <h5 style={{ color: '#28a745', margin: 0, fontWeight: "700" }}>₹{grandTotal.toFixed(2)}</h5>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #e0e0e0", padding: "12px 20px" }}>
          <Button 
            variant="light" 
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
            size="sm"
          >
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleSave}
            size="sm"
          >
            {editIndex !== null ? "Update Invoice" : "Save Invoice"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvoicePage;