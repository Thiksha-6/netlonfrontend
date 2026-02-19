import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, Row, Col, Spinner, Alert, Pagination, Dropdown } from "react-bootstrap";
import { Printer, Download, MessageCircle, FileText, PlusCircle, Trash2, Edit, QuoteIcon, RefreshCw, Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, FileDown, Receipt } from "lucide-react";
import { jsPDF } from "jspdf";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

const QuotationPage = () => {
  // ================= COMPANY INFO =================
  const [companyInfo, setCompanyInfo] = useState({
    name: "SRI RAJA MOSQUITO NETLON SERVICES",
    description: "Manufacture & Dealer in Mosquito & Insect Net (WholeSale & Retail)",
    phone: "+91 9790569529",
    address: "Ryan Complex Vadavalli Road, Edayarpalayam, Coimbatore-25",
    branch: "Edayarpalayam",
    gstin: "33BECPR927M1ZU"
  });

  // ================= BANK DETAILS =================
  const bankDetails = {
    accountHolder: "RAJASEKAR P",
    accountNumber: "50100774198590",
    ifsc: "HDFC0006806",
    branch: "EDAYARPALAYAM",
    accountType: "SAVING"
  };

  // ================= LOGO PATH =================
  const LOGO_PATH = "/asset/logo.png";

  // ================= STATE =================
  const [customerInfo, setCustomerInfo] = useState({
    billTo: "",
    stateName: "",
    contactNo: "",
    customerGstin: "",
    estimateNo: "",
    estimateDate: ""
  });

  const [items, setItems] = useState([
    { description: "", qty: 1, rate: 0, amount: 0 }
  ]);
  
  const [quotations, setQuotations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({
    total_quotations: 0,
    total_value: 0,
    this_month: 0,
    growth_percentage: 0
  });

  // ================= INVENTORY STATE =================
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});

  // ================= PAGINATION STATE =================
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // ================= WINDOW SIZE STATE =================
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ================= CALCULATIONS =================
  const totalAmount = items.reduce((a, b) => a + b.amount, 0);
  const grandTotal = totalAmount;

  // ================= API FUNCTIONS =================
  const fetchQuotations = async (page = 1, perPage = 10) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/quotations?page=${page}&per_page=${perPage}`);
      if (!response.ok) throw new Error('Failed to fetch quotations');
      const data = await response.json();
      setQuotations(data.quotations);
      setStats(data.stats || {});
      
      if (data.pagination) {
        setPagination({
          currentPage: data.pagination.page,
          totalPages: data.pagination.pages,
          totalItems: data.pagination.total,
          itemsPerPage: 10,
        });
      }
    } catch (err) {
      setError(`Error fetching quotations: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/company/info`);
      if (response.ok) {
        const data = await response.json();
        setCompanyInfo(data);
      }
    } catch (err) {
      console.error('Error fetching company info:', err);
    }
  };

  // ================= INVENTORY API FUNCTIONS =================
  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/`);
      if (response.ok) {
        const data = await response.json();
        setInventoryItems(data);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  // ================= WINDOW RESIZE HANDLER =================
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ================= HANDLERS =================
  const handleCustomerChange = (e) =>
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });

  const handleItemChange = (i, field, value) => {
    const data = [...items];
    data[i][field] = field === "description" ? value : Number(value);
    if (field === "qty" || field === "rate") {
      data[i].amount = data[i].qty * data[i].rate;
    }
    setItems(data);
  };

  const handleDescriptionSearch = (i, value) => {
    const newSearchTerms = { ...searchTerms, [i]: value };
    setSearchTerms(newSearchTerms);
    
    handleItemChange(i, "description", value);
    
    if (value.length >= 2) {
      const matches = inventoryItems.filter(item => 
        item.description.toLowerCase().includes(value.toLowerCase())
      );
      const newShowSuggestions = { ...showSuggestions, [i]: matches.length > 0 };
      setShowSuggestions(newShowSuggestions);
    } else {
      const newShowSuggestions = { ...showSuggestions, [i]: false };
      setShowSuggestions(newShowSuggestions);
    }
  };

  const handleSelectInventoryItem = (i, item) => {
    handleItemChange(i, "description", item.description);
    handleItemChange(i, "rate", item.rate);
    
    const newSearchTerms = { ...searchTerms, [i]: item.description };
    setSearchTerms(newSearchTerms);
    
    const newShowSuggestions = { ...showSuggestions, [i]: false };
    setShowSuggestions(newShowSuggestions);
  };

  const addItem = () =>
    setItems([...items, { description: "", qty: 1, rate: 0, amount: 0 }]);

  const removeItem = (i) => {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== i));
    }
  };

  // ================= PAGINATION HANDLERS =================
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages && page !== pagination.currentPage) {
      fetchQuotations(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const { currentPage, totalPages } = pagination;
    
    items.push(
      <Pagination.Item 
        key={1} 
        active={1 === currentPage}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );

    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(
          <Pagination.Item 
            key={i} 
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }

    if (totalPages > 1) {
      items.push(
        <Pagination.Item 
          key={totalPages} 
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  // ================= SAVE QUOTATION =================
  const handleSave = async () => {
    if (!customerInfo.billTo.trim()) {
      setError("Customer name is required");
      return;
    }
    if (!customerInfo.contactNo.trim()) {
      setError("Contact number is required");
      return;
    }
    if (items.some(item => !item.description.trim())) {
      setError("All items must have a description");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const formattedCustomerInfo = {
      ...customerInfo,
      estimateDate: customerInfo.estimateDate || null
    };

    const quotationData = {
      customerInfo: formattedCustomerInfo,
      items: items.map(item => ({
        description: item.description,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount
      })),
      totals: { 
        totalAmount,
        grandTotal
      }
    };

    try {
      let response;
      if (editId) {
        response = await fetch(`${API_BASE_URL}/quotations/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quotationData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/quotations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quotationData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.errors?.join(', ') || 'Failed to save quotation');
      }

      setSuccess(editId ? "Quotation updated successfully!" : "Quotation created successfully!");
      
      await fetchQuotations(pagination.currentPage);
      
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1000);

    } catch (err) {
      setError(`Error saving quotation: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setCustomerInfo({
      billTo: "",
      stateName: "",
      contactNo: "",
      customerGstin: "",
      estimateNo: "",
      estimateDate: ""
    });
    setItems([{ description: "", qty: 1, rate: 0, amount: 0 }]);
    setSearchTerms({});
    setShowSuggestions({});
    setEditId(null);
    setError("");
    setSuccess("");
  };

  // ================= VIEW QUOTATION =================
  const handleView = (quote) => {
    setSelectedQuotation(quote);
    setShowViewModal(true);
  };

  // ================= EDIT =================
  const handleEdit = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/quotations/${id}`);
      if (!response.ok) throw new Error('Failed to fetch quotation');
      const quote = await response.json();
      
      setCustomerInfo({
        billTo: quote.customerInfo.billTo || "",
        stateName: quote.customerInfo.stateName || "",
        contactNo: quote.customerInfo.contactNo || "",
        customerGstin: quote.customerInfo.customerGstin || "",
        estimateNo: quote.customerInfo.estimateNo || "",
        estimateDate: quote.customerInfo.estimateDate || ""
      });
      setItems(quote.items.map(item => ({
        description: item.description,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount
      })));
      setEditId(id);
      setShowModal(true);
    } catch (err) {
      setError(`Error loading quotation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE_URL}/quotations/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete quotation');
        
        setSuccess("Quotation deleted successfully!");
        await fetchQuotations(pagination.currentPage);
      } catch (err) {
        setError(`Error deleting quotation: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // ================= DOWNLOAD QUOTATION AS PDF =================
  const handleDownloadQuotationPDF = (quote) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 15;
    
    doc.addImage(LOGO_PATH, 'PNG', pageWidth/2 - 50, pageHeight/2 - 50, 100, 100, undefined, 'NONE', 0.1);
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(companyInfo.name, pageWidth / 2, yPos, { align: "center" });
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(companyInfo.description, pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text(`Phone: ${companyInfo.phone}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text(companyInfo.address, pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("QUOTATION", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    
    doc.setLineWidth(0.5);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details:", 14, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${quote.customerInfo.billTo}`, 14, yPos);
    doc.text(`Quotation No: Q-${quote.id}`, pageWidth - 70, yPos);
    yPos += 5;
    
    doc.text(`Contact: ${quote.customerInfo.contactNo}`, 14, yPos);
    doc.text(`Estimate No: ${quote.customerInfo.estimateNo || 'N/A'}`, pageWidth - 70, yPos);
    yPos += 5;
    
    doc.text(`State: ${quote.customerInfo.stateName || 'N/A'}`, 14, yPos);
    doc.text(`Date: ${quote.customerInfo.estimateDate || new Date().toLocaleDateString()}`, pageWidth - 70, yPos);
    yPos += 5;
    
    doc.text(`Customer GSTIN: ${quote.customerInfo.customerGstin || 'N/A'}`, 14, yPos);
    doc.text(`Branch: ${companyInfo.branch}`, pageWidth - 70, yPos);
    yPos += 5;
    
    doc.setLineWidth(0.5);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 5;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("S.No", 14, yPos);
    doc.text("Description", 30, yPos);
    doc.text("Qty", 140, yPos);
    doc.text("Rate (₹)", 155, yPos);
    doc.text("Amount (₹)", 180, yPos);
    yPos += 7;
    
    doc.setLineWidth(0.3);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 5;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    quote.items.forEach((item, index) => {
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = 15;
      }
      
      doc.text(`${index + 1}`, 14, yPos);
      
      const descriptionLines = doc.splitTextToSize(item.description, 100);
      if (descriptionLines.length > 1) {
        doc.text(descriptionLines[0], 30, yPos);
        yPos += 5;
        for (let i = 1; i < descriptionLines.length; i++) {
          doc.text(descriptionLines[i], 30, yPos);
          yPos += 5;
        }
        yPos -= 5 * (descriptionLines.length - 1);
      } else {
        doc.text(item.description, 30, yPos);
      }
      
      doc.text(item.qty.toString(), 140, yPos);
      doc.text(`₹${item.rate.toFixed(2)}`, 155, yPos);
      doc.text(`₹${item.amount.toFixed(2)}`, 180, yPos);
      yPos += 7;
    });
    
    yPos += 5;
    doc.setLineWidth(0.5);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL AMOUNT:", pageWidth - 70, yPos);
    doc.text(`₹${quote.totals.grandTotal.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" });
    yPos += 15;
    
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 15;
    }
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Bank Details:", 14, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Account Holder: ${bankDetails.accountHolder}`, 14, yPos);
    yPos += 5;
    doc.text(`Account Number: ${bankDetails.accountNumber}`, 14, yPos);
    yPos += 5;
    doc.text(`IFSC Code: ${bankDetails.ifsc}`, 14, yPos);
    yPos += 5;
    doc.text(`Branch: ${bankDetails.branch}`, 14, yPos);
    yPos += 5;
    doc.text(`Bank: HDFC BANK`, 14, yPos);
    yPos += 10;
    
    doc.setFontSize(9);
    doc.text("Thank you for your business!", pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text(`For any queries, please contact: ${companyInfo.phone}`, pageWidth / 2, yPos, { align: "center" });
    
    doc.save(`Quotation_${quote.customerInfo.estimateNo || quote.id}.pdf`);
  };

  // ================= DOWNLOAD INVOICE AS PDF =================
  const handleDownloadInvoicePDF = (quote) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 15;
    
    doc.addImage(LOGO_PATH, 'PNG', pageWidth/2 - 50, pageHeight/2 - 50, 100, 100, undefined, 'NONE', 0.1);
    
    const totalAmount = quote.items.reduce((sum, item) => sum + item.amount, 0);
    const cgst = totalAmount * 0.09;
    const sgst = totalAmount * 0.09;
    const grandTotal = totalAmount + cgst + sgst;
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(companyInfo.name, pageWidth / 2, yPos, { align: "center" });
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(companyInfo.description, pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text(`Phone: ${companyInfo.phone}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text(companyInfo.address, pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text(`GSTIN: ${companyInfo.gstin}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TAX INVOICE", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    
    doc.setLineWidth(0.5);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 14, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${quote.customerInfo.billTo}`, 14, yPos);
    doc.text(`Invoice No: INV-${quote.id}`, pageWidth - 70, yPos);
    yPos += 5;
    
    doc.text(`Contact: ${quote.customerInfo.contactNo}`, 14, yPos);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, pageWidth - 70, yPos);
    yPos += 5;
    
    doc.text(`State: ${quote.customerInfo.stateName || 'N/A'}`, 14, yPos);
    doc.text(`Order No: ${quote.customerInfo.estimateNo || 'N/A'}`, pageWidth - 70, yPos);
    yPos += 5;
    
    doc.text(`Order Date: ${quote.customerInfo.estimateDate || new Date().toLocaleDateString()}`, pageWidth - 70, yPos);
    yPos += 5;
    
    doc.text(`Customer GSTIN: ${quote.customerInfo.customerGstin || 'N/A'}`, 14, yPos);
    doc.text(`Branch: ${companyInfo.branch}`, pageWidth - 70, yPos);
    yPos += 10;
    
    doc.setLineWidth(0.5);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 5;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("S.No", 14, yPos);
    doc.text("Description", 30, yPos);
    doc.text("Qty", 140, yPos);
    doc.text("Rate (₹)", 155, yPos);
    doc.text("Amount (₹)", 180, yPos);
    yPos += 7;
    
    doc.setLineWidth(0.3);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 5;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    quote.items.forEach((item, index) => {
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = 15;
      }
      
      doc.text(`${index + 1}`, 14, yPos);
      
      const descriptionLines = doc.splitTextToSize(item.description, 100);
      if (descriptionLines.length > 1) {
        doc.text(descriptionLines[0], 30, yPos);
        yPos += 5;
        for (let i = 1; i < descriptionLines.length; i++) {
          doc.text(descriptionLines[i], 30, yPos);
          yPos += 5;
        }
        yPos -= 5 * (descriptionLines.length - 1);
      } else {
        doc.text(item.description, 30, yPos);
      }
      
      doc.text(item.qty.toString(), 140, yPos);
      doc.text(`₹${item.rate.toFixed(2)}`, 155, yPos);
      doc.text(`₹${item.amount.toFixed(2)}`, 180, yPos);
      yPos += 7;
    });
    
    yPos += 5;
    doc.setLineWidth(0.5);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Sub Total:", pageWidth - 70, yPos);
    doc.text(`₹${totalAmount.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" });
    yPos += 7;
    
    doc.text("CGST (9%):", pageWidth - 70, yPos);
    doc.text(`₹${cgst.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" });
    yPos += 7;
    
    doc.text("SGST (9%):", pageWidth - 70, yPos);
    doc.text(`₹${sgst.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" });
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text("GRAND TOTAL:", pageWidth - 70, yPos);
    doc.text(`₹${grandTotal.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" });
    yPos += 15;
    
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 15;
    }
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Bank Details:", 14, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Account Holder: ${bankDetails.accountHolder}`, 14, yPos);
    yPos += 5;
    doc.text(`Account Number: ${bankDetails.accountNumber}`, 14, yPos);
    yPos += 5;
    doc.text(`IFSC Code: ${bankDetails.ifsc}`, 14, yPos);
    yPos += 5;
    doc.text(`Branch: ${bankDetails.branch}`, 14, yPos);
    yPos += 5;
    doc.text(`Bank: HDFC BANK`, 14, yPos);
    yPos += 15;
    
    doc.setFontSize(9);
    doc.text("Thank you for your business!", pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text(`For any queries, please contact: ${companyInfo.phone}`, pageWidth / 2, yPos, { align: "center" });
    
    doc.save(`Invoice_${quote.customerInfo.estimateNo || quote.id}.pdf`);
  };

  // ================= PRINT QUOTATION =================
  const handlePrintQuotation = (quote) => {
    const html = generateQuotationHTML(quote);
    const printWindow = window.open('', '_blank', 'width=800,height=1123');
    if (!printWindow) {
      alert("Popup blocked! Please allow popups for this site.");
      return;
    }
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 1000);
  };

  // ================= PRINT INVOICE =================
  const handlePrintInvoice = (quote) => {
    const html = generateInvoiceHTML(quote);
    const printWindow = window.open('', '_blank', 'width=800,height=1123');
    if (!printWindow) {
      alert("Popup blocked! Please allow popups for this site.");
      return;
    }
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 1000);
  };

  // GENERATE QUOTATION HTML
  const generateQuotationHTML = (quote) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quotation ${quote.customerInfo.estimateNo || quote.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', 'Segoe UI', sans-serif; line-height: 1.6; color: #222; background: white; min-height: 100vh; position: relative; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.08; z-index: 1000; pointer-events: none; width: 400px; height: auto; }
    .watermark img { width: 100%; height: auto; object-fit: contain; }
    .shadow-text { text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15); }
    .heavy-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); }
    .light-shadow { text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.1); }
    .quotation-container { max-width: 790px; margin: 0 auto; border: 2px solid #333; padding: 25px; background: rgba(255, 255, 255, 0.95); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12); border-radius: 6px; position: relative; overflow: hidden; min-height: auto; z-index: 1; }
    .company-header { display: flex; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #2c3e50; position: relative; }
    .logo-container { flex: 0 0 100px; margin-right: 20px; }
    .logo { width: 100px; height: 100px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border: 2px solid #e0e0e0; }
    .company-details { flex: 1; }
    .company-details h2 { color: #2c3e50; margin-bottom: 8px; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }
    .company-details p { margin-bottom: 4px; color: #444; font-size: 13px; }
    .highlight { color: #e74c3c; font-weight: 700; }
    .quotation-title { text-align: center; margin: 20px 0; padding: 12px; background: linear-gradient(135deg, #ffffffff 0%, #f1f4f8ff 100%); border-radius: 8px; font-size: 26px; font-weight: 900; color: #003366; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); position: relative; overflow: hidden; border: 2px solid #00336602; }
    .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
    .bill-to, .customer-details { padding: 18px; background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%); border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-left: 4px solid #3498db; position: relative; }
    .bill-to h4, .customer-details h4 { color: #2c3e50; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #3498db; font-size: 18px; font-weight: 700; }
    .detail-row { display: flex; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dashed #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { flex: 0 0 120px; font-weight: 600; color: #495057; font-size: 13px; }
    .detail-value { flex: 1; color: #2c3e50; font-weight: 500; font-size: 13px; }
    .items-table { width: 100%; border-collapse: collapse; margin: 25px 0; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
    .items-table th { background: linear-gradient(135deg, #2c3e50 0%, #004aad 100%); color: white; padding: 12px 10px; text-align: center; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; border: none; position: relative; }
    .items-table td { padding: 10px 8px; border: 1px solid #e0e0e0; text-align: center; background: white; font-size: 13px; }
    .items-table tr:nth-child(even) td { background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f0 100%); }
    .items-table td:first-child { width: 50px; font-weight: 600; }
    .items-table td:nth-child(2) { text-align: left; font-weight: 500; }
    .totals-section { margin-top: 30px; padding-top: 15px; border-top: 2px solid #2c3e50; position: relative; }
    .total-row { display: flex; justify-content: flex-end; margin-bottom: 10px; padding: 8px 0; }
    .total-label { width: 180px; font-weight: 700; color: #495057; font-size: 16px; }
    .total-value { width: 180px; text-align: right; font-weight: 800; font-size: 18px; color: #2c3e50; }
    .grand-total { background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%); padding: 15px; border-radius: 8px; margin-top: 15px; border: 2px solid #3498db; }
    .grand-total .total-value { font-size: 22px; color: #e74c3c; }
    .bank-details { margin-top: 35px; padding: 20px; background: white; border: 1px solid #ddd; border-radius: 6px; border-left: 4px solid #2c3e50; position: relative; }
    .bank-details h4 { color: #2c3e50; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #3498db; font-size: 16px; font-weight: 600; }
    .bank-info-single-column { display: flex; flex-direction: column; gap: 8px; }
    .bank-row { display: flex; padding: 6px 0; border-bottom: 1px dashed #eee; }
    .bank-row:last-child { border-bottom: none; }
    .bank-label { flex: 0 0 160px; font-weight: 500; color: #495057; font-size: 13px; text-transform: capitalize; }
    .bank-value { flex: 1; color: #2c3e50; font-weight: 600; font-size: 13px; }
    .footer-note { margin-top: 30px; padding: 18px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 8px; text-align: center; border-top: 2px solid #3498db; }
    .footer-note p { color: #666; font-size: 13px; margin-bottom: 8px; }
    @media print { 
      body { padding: 0 !important; margin: 0 !important; background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } 
      .watermark { opacity: 0.08 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .quotation-container { border: 1px solid #000 !important; padding: 15px !important; background: white !important; box-shadow: none !important; }
      @page { size: A4 portrait !important; margin: 0.5cm !important; }
    }
  </style>
</head>
<body>
  <div class="watermark">
    <img src="${LOGO_PATH}" alt="Watermark">
  </div>
  <div class="quotation-container">
    <div class="company-header">
      <div class="logo-container">
        <img src="${LOGO_PATH}" alt="Company Logo" class="logo" onerror="this.style.display='none'">
      </div>
      <div class="company-details">
        <h2 class="heavy-shadow">${companyInfo.name}</h2>
        <p class="light-shadow">${companyInfo.description}</p>
        <p class="light-shadow"><span class="highlight heavy-shadow">${companyInfo.phone}</span></p>
        <p class="light-shadow">${companyInfo.address}</p>
        <p class="light-shadow"><strong>GST IN:</strong> ${companyInfo.gstin}</p>
      </div>
    </div>
    
    <div class="quotation-title heavy-shadow">QUOTATION</div>
    
    <div class="details-grid">
      <div class="bill-to">
        <h4 class="shadow-text">Customer Details</h4>
        <div class="detail-row">
          <div class="detail-label light-shadow">Bill To:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.billTo || 'N/A'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">Contact No:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.contactNo || 'N/A'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">State Name:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.stateName || 'Tamil Nadu'}</div>
        </div>
      </div>
      
      <div class="customer-details">
        <h4 class="shadow-text">Quotation Details</h4>
        <div class="detail-row">
          <div class="detail-label light-shadow">Quotation No:</div>
          <div class="detail-value shadow-text">Q-${quote.id}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">Estimate No:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.estimateNo || 'N/A'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">Estimate Date:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.estimateDate || new Date().toLocaleDateString()}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">Branch:</div>
          <div class="detail-value shadow-text">${companyInfo.branch || 'Edayarpalayam'}</div>
        </div>
      </div>
    </div>
    
    <table class="items-table">
      <thead>
        <tr>
          <th class="heavy-shadow">Si.No</th>
          <th class="heavy-shadow">Description</th>
          <th class="heavy-shadow">Qty</th>
          <th class="heavy-shadow">Rate (₹)</th>
          <th class="heavy-shadow">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${quote.items.map((item, index) => `
          <tr>
            <td class="shadow-text">${index + 1}</td>
            <td class="shadow-text" style="text-align: left;">${item.description}</td>
            <td class="shadow-text">${item.qty}</td>
            <td class="shadow-text">₹${(item.rate || 0).toFixed(2)}</td>
            <td class="shadow-text">₹${item.amount.toFixed(2)}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    
    <div class="totals-section">
      <div class="total-row grand-total">
        <div class="total-label shadow-text">TOTAL AMOUNT:</div>
        <div class="total-value shadow-text">₹${(quote.totals?.grandTotal || totalAmount).toFixed(2)}</div>
      </div>
    </div>
    
    <div class="bank-details">
      <h4 class="shadow-text">Bank Details</h4>
      <div class="bank-info-single-column">
        <div class="bank-row">
          <span class="bank-label light-shadow">Account Holder:</span>
          <span class="bank-value shadow-text">${bankDetails.accountHolder}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label light-shadow">Account Number:</span>
          <span class="bank-value shadow-text">${bankDetails.accountNumber}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label light-shadow">IFSC Code:</span>
          <span class="bank-value shadow-text">${bankDetails.ifsc}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label light-shadow">Branch:</span>
          <span class="bank-value shadow-text">${bankDetails.branch}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label light-shadow">Account Type:</span>
          <span class="bank-value shadow-text">${bankDetails.accountType}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label light-shadow">Bank Name:</span>
          <span class="bank-value shadow-text">HDFC BANK</span>
        </div>
      </div>
    </div>
    
    <div class="footer-note">
      <p class="light-shadow">Thank you for your business!</p>
      <p class="light-shadow">For any queries, please contact: ${companyInfo.phone}</p>
      <p class="light-shadow">Email: ${companyInfo.email || 'info@netlonservices.com'}</p>
    </div>
  </div>
</body>
</html>`;
  };

  // GENERATE INVOICE HTML
  const generateInvoiceHTML = (quote) => {
    const totalAmount = quote.items.reduce((sum, item) => sum + item.amount, 0);
    const cgst = totalAmount * 0.09;
    const sgst = totalAmount * 0.09;
    const grandTotal = totalAmount + cgst + sgst;
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${quote.customerInfo.estimateNo || quote.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', 'Segoe UI', sans-serif; line-height: 1.6; color: #222; background: white; min-height: 100vh; position: relative; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.08; z-index: 1000; pointer-events: none; width: 400px; height: auto; }
    .watermark img { width: 100%; height: auto; object-fit: contain; }
    .shadow-text { text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15); }
    .heavy-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); }
    .light-shadow { text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.1); }
    .invoice-container { max-width: 790px; margin: 0 auto; border: 2px solid #333; padding: 25px; background: rgba(255, 255, 255, 0.95); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12); border-radius: 6px; position: relative; overflow: hidden; min-height: auto; z-index: 1; }
    .company-header { display: flex; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #2c3e50; position: relative; }
    .logo-container { flex: 0 0 100px; margin-right: 20px; }
    .logo { width: 100px; height: 100px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border: 2px solid #e0e0e0; }
    .company-details { flex: 1; }
    .company-details h2 { color: #2c3e50; margin-bottom: 8px; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }
    .company-details p { margin-bottom: 4px; color: #444; font-size: 13px; }
    .highlight { color: #e74c3c; font-weight: 700; }
    .invoice-title { text-align: center; margin: 20px 0; padding: 12px; background: linear-gradient(135deg, #ffffffff 0%, #f1f4f8ff 100%); border-radius: 8px; font-size: 26px; font-weight: 900; color: #dc3545; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); position: relative; overflow: hidden; border: 2px solid #dc354502; }
    .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
    .bill-to, .invoice-details { padding: 18px; background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%); border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-left: 4px solid #dc3545; position: relative; }
    .bill-to h4, .invoice-details h4 { color: #2c3e50; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #dc3545; font-size: 18px; font-weight: 700; }
    .detail-row { display: flex; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dashed #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { flex: 0 0 120px; font-weight: 600; color: #495057; font-size: 13px; }
    .detail-value { flex: 1; color: #2c3e50; font-weight: 500; font-size: 13px; }
    .items-table { width: 100%; border-collapse: collapse; margin: 25px 0; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
    .items-table th { background: linear-gradient(135deg, #2c3e50 0%, #dc3545 100%); color: white; padding: 12px 10px; text-align: center; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; border: none; position: relative; }
    .items-table td { padding: 10px 8px; border: 1px solid #e0e0e0; text-align: center; background: white; font-size: 13px; }
    .items-table tr:nth-child(even) td { background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f0 100%); }
    .items-table td:first-child { width: 50px; font-weight: 600; }
    .items-table td:nth-child(2) { text-align: left; font-weight: 500; }
    .totals-section { margin-top: 30px; padding-top: 15px; border-top: 2px solid #2c3e50; position: relative; }
    .total-row { display: flex; justify-content: flex-end; margin-bottom: 10px; padding: 8px 0; }
    .total-label { width: 180px; font-weight: 700; color: #495057; font-size: 16px; }
    .total-value { width: 180px; text-align: right; font-weight: 800; font-size: 18px; color: #2c3e50; }
    .grand-total { background: linear-gradient(135deg, #f8f9fa 0%, #ffe6e6 100%); padding: 15px; border-radius: 8px; margin-top: 15px; border: 2px solid #dc3545; }
    .grand-total .total-value { font-size: 22px; color: #dc3545; }
    .bank-details { margin-top: 35px; padding: 20px; background: white; border: 1px solid #ddd; border-radius: 6px; border-left: 4px solid #dc3545; position: relative; }
    .bank-details h4 { color: #2c3e50; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #dc3545; font-size: 16px; font-weight: 600; }
    .bank-info-single-column { display: flex; flex-direction: column; gap: 8px; }
    .bank-row { display: flex; padding: 6px 0; border-bottom: 1px dashed #eee; }
    .bank-row:last-child { border-bottom: none; }
    .bank-label { flex: 0 0 160px; font-weight: 500; color: #495057; font-size: 13px; text-transform: capitalize; }
    .bank-value { flex: 1; color: #2c3e50; font-weight: 600; font-size: 13px; }
    .footer-note { margin-top: 30px; padding: 18px; background: linear-gradient(135deg, #f8f9fa 0%, #ffe6e6 100%); border-radius: 8px; text-align: center; border-top: 2px solid #dc3545; }
    .footer-note p { color: #666; font-size: 13px; margin-bottom: 8px; }
    @media print { 
      body { padding: 0 !important; margin: 0 !important; background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } 
      .watermark { opacity: 0.08 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .invoice-container { border: 1px solid #000 !important; padding: 15px !important; background: white !important; box-shadow: none !important; }
      @page { size: A4 portrait !important; margin: 0.5cm !important; }
    }
  </style>
</head>
<body>
  <div class="watermark">
    <img src="${LOGO_PATH}" alt="Watermark">
  </div>
  <div class="invoice-container">
    <div class="company-header">
      <div class="logo-container">
        <img src="${LOGO_PATH}" alt="Company Logo" class="logo" onerror="this.style.display='none'">
      </div>
      <div class="company-details">
        <h2 class="heavy-shadow">${companyInfo.name}</h2>
        <p class="light-shadow">${companyInfo.description}</p>
        <p class="light-shadow"><span class="highlight heavy-shadow">${companyInfo.phone}</span></p>
        <p class="light-shadow">${companyInfo.address}</p>
        <p class="light-shadow"><strong>GST IN:</strong> ${companyInfo.gstin}</p>
      </div>
    </div>
    
    <div class="invoice-title heavy-shadow">TAX INVOICE</div>
    
    <div class="details-grid">
      <div class="bill-to">
        <h4 class="shadow-text">Bill To</h4>
        <div class="detail-row">
          <div class="detail-label light-shadow">Customer Name:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.billTo || 'N/A'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">Contact No:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.contactNo || 'N/A'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">State Name:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.stateName || 'Tamil Nadu'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">Customer GSTIN:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.customerGstin || 'N/A'}</div>
        </div>
      </div>
      
      <div class="invoice-details">
        <h4 class="shadow-text">Invoice Details</h4>
        <div class="detail-row">
          <div class="detail-label light-shadow">Invoice No:</div>
          <div class="detail-value shadow-text">INV-${quote.id}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">Invoice Date:</div>
          <div class="detail-value shadow-text">${new Date().toLocaleDateString()}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">Estimate No:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.estimateNo || 'N/A'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">Estimate Date:</div>
          <div class="detail-value shadow-text">${quote.customerInfo.estimateDate || new Date().toLocaleDateString()}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label light-shadow">Branch:</div>
          <div class="detail-value shadow-text">${companyInfo.branch || 'Edayarpalayam'}</div>
        </div>
      </div>
    </div>
    
    <table class="items-table">
      <thead>
        <tr>
          <th class="heavy-shadow">Si.No</th>
          <th class="heavy-shadow">Description</th>
          <th class="heavy-shadow">Qty</th>
          <th class="heavy-shadow">Rate (₹)</th>
          <th class="heavy-shadow">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${quote.items.map((item, index) => `
          <tr>
            <td class="shadow-text">${index + 1}</td>
            <td class="shadow-text" style="text-align: left;">${item.description}</td>
            <td class="shadow-text">${item.qty}</td>
            <td class="shadow-text">₹${(item.rate || 0).toFixed(2)}</td>
            <td class="shadow-text">₹${item.amount.toFixed(2)}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    
    <div class="totals-section">
      <div class="total-row">
        <div class="total-label shadow-text">SUB TOTAL:</div>
        <div class="total-value shadow-text">₹${totalAmount.toFixed(2)}</div>
      </div>
      <div class="total-row">
        <div class="total-label shadow-text">CGST (9%):</div>
        <div class="total-value shadow-text">₹${cgst.toFixed(2)}</div>
      </div>
      <div class="total-row">
        <div class="total-label shadow-text">SGST (9%):</div>
        <div class="total-value shadow-text">₹${sgst.toFixed(2)}</div>
      </div>
      <div class="total-row grand-total">
        <div class="total-label shadow-text">GRAND TOTAL:</div>
        <div class="total-value shadow-text">₹${grandTotal.toFixed(2)}</div>
      </div>
    </div>
    
    <div class="bank-details">
      <h4 class="shadow-text">Bank Details</h4>
      <div class="bank-info-single-column">
        <div class="bank-row">
          <span class="bank-label light-shadow">Account Holder:</span>
          <span class="bank-value shadow-text">${bankDetails.accountHolder}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label light-shadow">Account Number:</span>
          <span class="bank-value shadow-text">${bankDetails.accountNumber}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label light-shadow">IFSC Code:</span>
          <span class="bank-value shadow-text">${bankDetails.ifsc}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label light-shadow">Branch:</span>
          <span class="bank-value shadow-text">${bankDetails.branch}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label light-shadow">Account Type:</span>
          <span class="bank-value shadow-text">${bankDetails.accountType}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label light-shadow">Bank Name:</span>
          <span class="bank-value shadow-text">HDFC BANK</span>
        </div>
      </div>
    </div>
    
    <div class="footer-note">
      <p class="light-shadow">Thank you for your business!</p>
      <p class="light-shadow">For any queries, please contact: ${companyInfo.phone}</p>
      <p class="light-shadow">Email: ${companyInfo.email || 'info@netlonservices.com'}</p>
    </div>
  </div>
</body>
</html>`;
  };

  // ================= WHATSAPP =================
  const sendWhatsApp = (quote) => {
    if (!quote.customerInfo.contactNo) {
      alert("No contact number available for this customer.");
      return;
    }
    
    const phoneNumber = quote.customerInfo.contactNo.replace(/[\s+\-()]/g, '');
    
    const message = `Dear ${quote.customerInfo.billTo || 'Customer'},

*Quotation Details:*
Quotation No: Q-${quote.id}
Estimate No: ${quote.customerInfo.estimateNo || 'N/A'}
Date: ${quote.customerInfo.estimateDate || new Date().toLocaleDateString()}
Customer GSTIN: ${quote.customerInfo.customerGstin || 'N/A'}

*Items:*
${quote.items.map((item, i) => `${i+1}. ${item.description} - Qty: ${item.qty} - Rate: ₹${item.rate.toFixed(2)}`).join('\n')}

*Amount Summary:*
Total Amount: ₹${quote.totals.grandTotal.toFixed(2)}

Thank you for your business!

Best regards,
${companyInfo.name}
${companyInfo.phone}
GSTIN: ${companyInfo.gstin}`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // ================= USE EFFECT =================
  useEffect(() => {
    fetchQuotations();
    fetchCompanyInfo();
    fetchInventory();
  }, []);

  // ================= RENDER =================
  return (
    <div style={{ 
      marginTop: windowWidth > 768 ? "70px" : "0px",
      padding: windowWidth <= 768 ? "10px" : "20px",
      backgroundColor: "#f8f9fa",
      minHeight: windowWidth > 768 ? "calc(100vh - 70px)" : "100vh",
      width: "100%" 
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: "20px", 
        padding: windowWidth <= 768 ? "15px" : "20px", 
        backgroundColor: "white", 
        borderRadius: "8px", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        background: "linear-gradient(135deg, #004aad, #00bfff)",
        color: "white"
      }}>
        <div style={{ 
          display: "flex", 
          flexDirection: windowWidth <= 768 ? "column" : "row",
          justifyContent: "space-between", 
          alignItems: windowWidth <= 768 ? "flex-start" : "center",
          gap: windowWidth <= 768 ? "15px" : "0"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "20px",
            width: windowWidth <= 768 ? "100%" : "auto"
          }}>
            {/* Company Logo */}
            <div style={{ 
              width: windowWidth <= 768 ? "60px" : "80px", 
              height: windowWidth <= 768 ? "60px" : "80px", 
              borderRadius: "10px", 
              backgroundColor: "white", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              flexShrink: 0
            }}>
              <img 
                src={LOGO_PATH} 
                alt="Company Logo" 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "contain",
                  padding: "5px"
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;base64," + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
                      <rect width="80" height="80" fill="#2c3e50" rx="10"/>
                      <text x="40" y="35" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">SRI RAJA</text>
                      <text x="40" y="50" text-anchor="middle" fill="#ecf0f1" font-family="Arial" font-size="10">MOSQUITO NET</text>
                      <text x="40" y="65" text-anchor="middle" fill="#bdc3c7" font-family="Arial" font-size="8">SERVICES</text>
                    </svg>
                  `);
                }}
              />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: windowWidth <= 768 ? "1rem" : "1.5rem" }}>
                {windowWidth <= 768 ? "Quotations" : "Quotation Management"}
              </h4>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: "8px 0 0 0", fontSize: windowWidth <= 768 ? "0.8rem" : "1rem" }}>
                {windowWidth <= 768 ? `${companyInfo.name}` : `${companyInfo.name} | ${companyInfo.phone} | GSTIN: ${companyInfo.gstin}`}
              </p>
            </div>
          </div>
          <div style={{ 
            display: "flex", 
            gap: "10px",
            width: windowWidth <= 768 ? "100%" : "auto",
            justifyContent: windowWidth <= 768 ? "flex-start" : "flex-end"
          }}>
            <Button 
              variant="outline-light" 
              onClick={() => fetchQuotations(pagination.currentPage)}
              disabled={loading}
              style={{ 
                padding: windowWidth <= 768 ? "8px 12px" : "10px 20px", 
                fontWeight: "600",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: windowWidth <= 768 ? "0.85rem" : "1rem"
              }}
            >
              <RefreshCw size={windowWidth <= 768 ? 16 : 18} />
              {windowWidth > 768 && "Refresh"}
            </Button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible style={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible style={{ marginBottom: "20px" }}>
          {success}
        </Alert>
      )}

      {/* Stats Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: windowWidth <= 768 ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "15px", 
        marginBottom: "20px" 
      }}>
        <div style={{ 
          backgroundColor: "white", 
          padding: windowWidth <= 768 ? "15px" : "20px", 
          borderRadius: "8px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderLeft: "4px solid #007bff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h6 style={{ color: "#6c757d", margin: 0, fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem", fontWeight: "600" }}>Total Quotations</h6>
              <h3 style={{ color: "#2c3e50", margin: "8px 0 0 0", fontWeight: "700", fontSize: windowWidth <= 768 ? "1.5rem" : "1.75rem" }}>
                {loading ? <Spinner animation="border" size="sm" /> : pagination.totalItems}
              </h3>
            </div>
            <div style={{ 
              width: windowWidth <= 768 ? "40px" : "50px", 
              height: windowWidth <= 768 ? "40px" : "50px", 
              borderRadius: "50%", 
              backgroundColor: "rgba(0,123,255,0.1)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "#007bff"
            }}>
              <FileText size={windowWidth <= 768 ? 20 : 24} />
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          padding: windowWidth <= 768 ? "15px" : "20px", 
          borderRadius: "8px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderLeft: "4px solid #28a745"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h6 style={{ color: "#6c757d", margin: 0, fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem", fontWeight: "600" }}>Total Value</h6>
              <h3 style={{ color: "#28a745", margin: "8px 0 0 0", fontWeight: "700", fontSize: windowWidth <= 768 ? "1.5rem" : "1.75rem" }}>
                {loading ? <Spinner animation="border" size="sm" /> : `₹${(stats.total_value || 0).toFixed(2)}`}
              </h3>
            </div>
            <div style={{ 
              width: windowWidth <= 768 ? "40px" : "50px", 
              height: windowWidth <= 768 ? "40px" : "50px", 
              borderRadius: "50%", 
              backgroundColor: "rgba(40,167,69,0.1)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "#28a745"
            }}>
              ₹
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          padding: windowWidth <= 768 ? "15px" : "20px", 
          borderRadius: "8px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderLeft: "4px solid #ffc107"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h6 style={{ color: "#6c757d", margin: 0, fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem", fontWeight: "600" }}>This Month</h6>
              <h3 style={{ color: "#ffc107", margin: "8px 0 0 0", fontWeight: "700", fontSize: windowWidth <= 768 ? "1.5rem" : "1.75rem" }}>
                {loading ? <Spinner animation="border" size="sm" /> : (stats.this_month || 0)}
              </h3>
              {stats.growth_percentage !== 0 && (
                <small style={{ color: stats.growth_percentage > 0 ? "#28a745" : "#dc3545", fontSize: windowWidth <= 768 ? "0.7rem" : "0.8rem" }}>
                  {stats.growth_percentage > 0 ? "↑" : "↓"} {Math.abs(stats.growth_percentage)}% from last month
                </small>
              )}
            </div>
            <div style={{ 
              width: windowWidth <= 768 ? "40px" : "50px", 
              height: windowWidth <= 768 ? "40px" : "50px", 
              borderRadius: "50%", 
              backgroundColor: "rgba(255,193,7,0.1)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "#ffc107"
            }}>
              <FileText size={windowWidth <= 768 ? 20 : 24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quotations List */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "8px", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
        overflow: "hidden",
        marginBottom: "20px"
      }}>
        <div style={{ 
          padding: windowWidth <= 768 ? "15px" : "20px", 
          borderBottom: "1px solid #e0e0e0", 
          backgroundColor: "#f8f9fa",
          display: "flex",
          flexDirection: windowWidth <= 768 ? "column" : "row",
          justifyContent: "space-between",
          alignItems: windowWidth <= 768 ? "flex-start" : "center",
          gap: windowWidth <= 768 ? "10px" : "0"
        }}>
          <h5 style={{ 
            color: "#083b6eff", 
            margin: 0, 
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: windowWidth <= 768 ? "1rem" : "1.25rem"
          }}>
            <FileText size={windowWidth <= 768 ? 18 : 20} />
            Recent Quotations
            {loading && <Spinner animation="border" size="sm" />}
          </h5>
          <div style={{ 
            display: "flex", 
            gap: "10px", 
            alignItems: "center",
            width: windowWidth <= 768 ? "100%" : "auto",
            justifyContent: windowWidth <= 768 ? "space-between" : "flex-end"
          }}>
            <span style={{ 
              backgroundColor: "#007bff", 
              color: "white", 
              padding: "4px 12px", 
              borderRadius: "12px", 
              fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", 
              fontWeight: "500",
              whiteSpace: "nowrap"
            }}>
              {windowWidth <= 768 ? `${quotations.length}/${pagination.totalItems}` : `Showing ${quotations.length} of ${pagination.totalItems} quotations`}
            </span>
            <Button 
              size="sm" 
              variant="outline-primary"
              onClick={() => setShowModal(true)}
              style={{ 
                padding: windowWidth <= 768 ? "6px 12px" : "4px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem",
                whiteSpace: "nowrap"
              }}
            >
              <PlusCircle size={windowWidth <= 768 ? 14 : 16} />
              {windowWidth > 768 ? "New" : "New"}
            </Button>
          </div>
        </div>
        
        {/* Pagination Controls - Top */}
        <div style={{ 
          padding: windowWidth <= 768 ? "12px 15px" : "15px 20px", 
          borderBottom: "1px solid #e0e0e0", 
          backgroundColor: "#f8f9fa",
          display: "flex",
          flexDirection: windowWidth <= 768 ? "column" : "row",
          justifyContent: "space-between",
          alignItems: windowWidth <= 768 ? "flex-start" : "center",
          gap: windowWidth <= 768 ? "10px" : "0"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#6c757d", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>10 items per page</span>
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: windowWidth <= 768 ? "10px" : "15px",
            flexWrap: windowWidth <= 768 ? "wrap" : "nowrap",
            width: windowWidth <= 768 ? "100%" : "auto"
          }}>
            <span style={{ color: "#6c757d", fontSize: windowWidth <= 768 ? "0.75rem" : "0.9rem", whiteSpace: "nowrap" }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1 || loading}
                style={{ padding: "4px 8px" }}
                title="First page"
              >
                <ChevronsLeft size={windowWidth <= 768 ? 14 : 16} />
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
                style={{ padding: "4px 8px" }}
                title="Previous page"
              >
                <ChevronLeft size={windowWidth <= 768 ? 14 : 16} />
              </Button>
              
              {windowWidth > 768 && (
                <div style={{ display: "flex" }}>
                  <Pagination style={{ margin: 0 }}>
                    {renderPaginationItems()}
                  </Pagination>
                </div>
              )}
              
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages || loading}
                style={{ padding: "4px 8px" }}
                title="Next page"
              >
                <ChevronRight size={windowWidth <= 768 ? 14 : 16} />
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages || loading}
                style={{ padding: "4px 8px" }}
                title="Last page"
              >
                <ChevronsRight size={windowWidth <= 768 ? 14 : 16} />
              </Button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <Spinner animation="border" variant="primary" />
            <p style={{ marginTop: "10px", color: "#6c757d" }}>Loading quotations...</p>
          </div>
        ) : quotations.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <Table hover responsive style={{ margin: 0, minWidth: windowWidth <= 768 ? "1000px" : "100%" }}>
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th style={{ padding: "12px 15px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600", width: "60px" }}>#</th>
                  <th style={{ padding: "12px 15px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Quotation No</th>
                  <th style={{ padding: "12px 15px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Customer</th>
                  <th style={{ padding: "12px 15px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Contact</th>
                  {windowWidth > 768 && (
                    <>
                      <th style={{ padding: "12px 15px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Customer GSTIN</th>
                      <th style={{ padding: "12px 15px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Estimate No</th>
                    </>
                  )}
                  <th style={{ padding: "12px 15px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600" }}>Total Amount</th>
                  <th style={{ padding: "12px 15px", borderBottom: "1px solid #e0e0e0", color: "#495057", fontWeight: "600", width: windowWidth <= 768 ? "100px" : "320px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((quote, i) => (
                  <tr key={quote.id} style={{ 
                    borderBottom: "1px solid #f0f0f0", 
                    backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa"
                  }}>
                    <td style={{ padding: "12px 15px", color: "#6c757d", fontWeight: "500" }}>
                      {(pagination.currentPage - 1) * pagination.itemsPerPage + i + 1}
                    </td>
                    <td style={{ padding: "12px 15px", color: "#007bff", fontWeight: "600" }}>
                      Q-{quote.id}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <strong style={{ color: "#2c3e50" }}>{quote.customerInfo.billTo}</strong>
                      {quote.customerInfo.stateName && windowWidth > 768 && (
                        <div style={{ color: "#6c757d", fontSize: "0.85rem", marginTop: "2px" }}>
                          {quote.customerInfo.stateName}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 15px", color: "#6c757d", fontWeight: "500" }}>
                      {quote.customerInfo.contactNo}
                    </td>
                    {windowWidth > 768 && (
                      <>
                        <td style={{ padding: "12px 15px", color: "#6c757d", fontWeight: "500" }}>
                          {quote.customerInfo.customerGstin || "N/A"}
                        </td>
                        <td style={{ padding: "12px 15px", color: "#6c757d", fontWeight: "500" }}>
                          {quote.customerInfo.estimateNo || "N/A"}
                          {quote.customerInfo.estimateDate && (
                            <div style={{ color: "#6c757d", fontSize: "0.8rem", marginTop: "2px" }}>
                              {quote.customerInfo.estimateDate}
                            </div>
                          )}
                        </td>
                      </>
                    )}
                    <td style={{ padding: "12px 15px" }}>
                      <strong style={{ color: "#28a745", fontSize: windowWidth <= 768 ? "1rem" : "1.1rem", fontWeight: "600" }}>
                        ₹{quote.totals.grandTotal.toFixed(2)}
                      </strong>
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      {windowWidth <= 768 ? (
                        // Mobile view - Dropdown menu
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="outline-secondary" 
                            size="sm"
                            style={{ 
                              padding: "6px 12px",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              width: "100%",
                              justifyContent: "space-between"
                            }}
                          >
                            <span>Actions</span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ minWidth: "200px" }}>
                            <Dropdown.Item onClick={() => handleView(quote)}>
                              <Eye size={16} style={{ marginRight: "8px" }} /> View
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => sendWhatsApp(quote)}>
                              <MessageCircle size={16} style={{ marginRight: "8px" }} /> WhatsApp
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handlePrintQuotation(quote)}>
                              <Printer size={16} style={{ marginRight: "8px" }} /> Print Q
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handlePrintInvoice(quote)}>
                              <Printer size={16} style={{ marginRight: "8px" }} /> Print INV
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => handleEdit(quote.id)}>
                              <Edit size={16} style={{ marginRight: "8px" }} /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(quote.id)} className="text-danger">
                              <Trash2 size={16} style={{ marginRight: "8px" }} /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (
                        // Desktop view - Horizontal buttons
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          <Button 
                            size="sm" 
                            variant="outline-info" 
                            onClick={() => handleView(quote)}
                            title="View"
                            style={{ 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              borderWidth: "1px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Eye size={16} />
                            <span style={{ fontSize: "0.8rem" }}>View</span>
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline-success" 
                            onClick={() => sendWhatsApp(quote)}
                            title="Send WhatsApp"
                            style={{ 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              borderWidth: "1px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <MessageCircle size={16} />
                            <span style={{ fontSize: "0.8rem" }}>WhatsApp</span>
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            onClick={() => handlePrintQuotation(quote)}
                            title="Print Quotation"
                            style={{ 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              borderWidth: "1px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Printer size={16} />
                            <span style={{ fontSize: "0.8rem" }}>Print Q</span>
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline-warning" 
                            onClick={() => handlePrintInvoice(quote)}
                            title="Print Invoice"
                            style={{ 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              borderWidth: "1px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Printer size={16} />
                            <span style={{ fontSize: "0.8rem" }}>Print INV</span>
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline-warning" 
                            onClick={() => handleEdit(quote.id)}
                            title="Edit"
                            style={{ 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              borderWidth: "1px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Edit size={16} />
                            <span style={{ fontSize: "0.8rem" }}>Edit</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-danger" 
                            onClick={() => handleDelete(quote.id)}
                            title="Delete"
                            style={{ 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              borderWidth: "1px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Trash2 size={16} />
                            <span style={{ fontSize: "0.8rem" }}>Delete</span>
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: windowWidth <= 768 ? "40px 20px" : "80px 20px", 
            backgroundColor: "white"
          }}>
            <div style={{ 
              width: windowWidth <= 768 ? "80px" : "100px", 
              height: windowWidth <= 768 ? "80px" : "100px", 
              borderRadius: "50%", 
              backgroundColor: "#f8f9fa", 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center",
              marginBottom: "20px"
            }}>
              <QuoteIcon size={windowWidth <= 768 ? 36 : 48} style={{ color: "#dee2e6" }} />
            </div>
            <h5 style={{ color: "#6c757d", marginBottom: "10px", fontWeight: "600", fontSize: windowWidth <= 768 ? "1rem" : "1.25rem" }}>No quotations yet</h5>
            <p style={{ color: "#adb5bd", marginBottom: "20px", maxWidth: "400px", marginLeft: "auto", marginRight: "auto", fontSize: windowWidth <= 768 ? "0.85rem" : "1rem" }}>
              Start by creating your first quotation. It will appear here once saved.
            </p>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              style={{ 
                padding: windowWidth <= 768 ? "8px 20px" : "10px 24px", 
                borderRadius: "6px", 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "0 auto",
                fontSize: windowWidth <= 768 ? "0.85rem" : "1rem"
              }}
            >
              <PlusCircle size={windowWidth <= 768 ? 16 : 18} />
              Create First Quotation
            </Button>
          </div>
        )}
        
        {/* Pagination Controls - Bottom */}
        {quotations.length > 0 && (
          <div style={{ 
            padding: windowWidth <= 768 ? "12px 15px" : "15px 20px", 
            borderTop: "1px solid #e0e0e0", 
            backgroundColor: "#f8f9fa",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1 || loading}
                style={{ padding: "4px 8px" }}
                title="First page"
              >
                <ChevronsLeft size={16} />
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
                style={{ padding: "4px 8px" }}
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </Button>
              
              <span style={{ color: "#6c757d", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem", margin: "0 10px" }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages || loading}
                style={{ padding: "4px 8px" }}
                title="Next page"
              >
                <ChevronRight size={16} />
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages || loading}
                style={{ padding: "4px 8px" }}
                title="Last page"
              >
                <ChevronsRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Quotation Modal */}
      <Modal 
        show={showViewModal} 
        onHide={() => setShowViewModal(false)}
        size="lg"
        centered
        fullscreen={windowWidth <= 768 ? true : undefined}
      >
        <Modal.Header closeButton style={{ 
          borderBottom: "1px solid #e0e0e0", 
          backgroundColor: "#17a2b8", 
          color: "white",
          padding: windowWidth <= 768 ? "12px 15px" : "15px 25px"
        }}>
          <Modal.Title style={{ fontSize: windowWidth <= 768 ? "1rem" : "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px" }}>
            <Eye size={windowWidth <= 768 ? 18 : 20} />
            View Quotation: {selectedQuotation?.customerInfo.estimateNo || selectedQuotation?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: windowWidth <= 768 ? "none" : "70vh", overflowY: "auto", padding: windowWidth <= 768 ? "15px" : "25px" }}>
          {selectedQuotation && (
            <div>
              <div style={{ marginBottom: "25px" }}>
                <h6 style={{ color: "#495057", marginBottom: "15px", fontSize: windowWidth <= 768 ? "0.9rem" : "1rem", fontWeight: "600", paddingBottom: "10px", borderBottom: "1px solid #e0e0e0" }}>
                  Customer Details
                </h6>
                <Row>
                  <Col md={6}>
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#6c757d", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>Bill To:</strong>
                      <div style={{ color: "#495057", marginTop: "4px", fontSize: windowWidth <= 768 ? "0.9rem" : "1rem" }}>{selectedQuotation.customerInfo.billTo}</div>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#6c757d", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>State Name:</strong>
                      <div style={{ color: "#495057", marginTop: "4px", fontSize: windowWidth <= 768 ? "0.9rem" : "1rem" }}>{selectedQuotation.customerInfo.stateName || "N/A"}</div>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#6c757d", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>Customer GSTIN:</strong>
                      <div style={{ color: "#495057", marginTop: "4px", fontSize: windowWidth <= 768 ? "0.9rem" : "1rem" }}>{selectedQuotation.customerInfo.customerGstin || "N/A"}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#6c757d", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>Contact No:</strong>
                      <div style={{ color: "#495057", marginTop: "4px", fontSize: windowWidth <= 768 ? "0.9rem" : "1rem" }}>{selectedQuotation.customerInfo.contactNo}</div>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#6c757d", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>Estimate No:</strong>
                      <div style={{ color: "#495057", marginTop: "4px", fontSize: windowWidth <= 768 ? "0.9rem" : "1rem" }}>{selectedQuotation.customerInfo.estimateNo || "N/A"}</div>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#6c757d", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>Estimate Date:</strong>
                      <div style={{ color: "#495057", marginTop: "4px", fontSize: windowWidth <= 768 ? "0.9rem" : "1rem" }}>{selectedQuotation.customerInfo.estimateDate || "N/A"}</div>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#6c757d", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>Branch:</strong>
                      <div style={{ color: "#495057", marginTop: "4px", fontSize: windowWidth <= 768 ? "0.9rem" : "1rem" }}>{companyInfo.branch}</div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <h6 style={{ color: "#495057", marginBottom: "15px", fontSize: windowWidth <= 768 ? "0.9rem" : "1rem", fontWeight: "600", paddingBottom: "10px", borderBottom: "1px solid #e0e0e0" }}>
                  Items
                </h6>
                <div style={{ overflowX: "auto" }}>
                  <Table bordered hover size="sm" style={{ minWidth: windowWidth <= 768 ? "600px" : "100%" }}>
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                      <tr>
                        <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600", width: "50px" }}>S.No</th>
                        <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600" }}>Description</th>
                        <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600", width: "100px" }}>Qty</th>
                        <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600", width: "120px" }}>Rate (₹)</th>
                        <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600", width: "120px" }}>Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuotation.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 12px", textAlign: "center", color: "#6c757d", fontWeight: "500", verticalAlign: "middle" }}>
                            {i + 1}
                          </td>
                          <td style={{ padding: "10px 12px", verticalAlign: "middle", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>
                            {item.description}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "center", verticalAlign: "middle", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>
                            {item.qty}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", verticalAlign: "middle", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>
                            ₹{item.rate.toFixed(2)}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: "#28a745", fontWeight: "600", verticalAlign: "middle", fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem" }}>
                            ₹{item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              <div style={{ 
                backgroundColor: "#f8f9fa", 
                padding: windowWidth <= 768 ? "15px" : "20px", 
                borderRadius: "8px", 
                border: "1px solid #e9ecef"
              }}>
                <h6 style={{ color: "#495057", marginBottom: "15px", fontSize: windowWidth <= 768 ? "0.9rem" : "1rem", fontWeight: "600", paddingBottom: "10px", borderBottom: "1px solid #dee2e6" }}>
                  Totals Summary
                </h6>
                <Row>
                  <Col md={8}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      padding: windowWidth <= 768 ? "10px 12px" : "12px 15px", 
                      backgroundColor: "white", 
                      borderRadius: "6px",
                      marginTop: "10px",
                      border: "2px solid #007bff"
                    }}>
                      <h5 style={{ color: "#007bff", margin: 0, fontWeight: "700", fontSize: windowWidth <= 768 ? "1rem" : "1.2rem" }}>Total Amount:</h5>
                      <h5 style={{ color: '#007bff', margin: 0, fontWeight: "700", fontSize: windowWidth <= 768 ? "1rem" : "1.2rem" }}>₹{selectedQuotation.totals.grandTotal.toFixed(2)}</h5>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #e0e0e0", padding: windowWidth <= 768 ? "12px 15px" : "15px 25px" }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowViewModal(false)}
            style={{ 
              padding: windowWidth <= 768 ? "6px 12px" : "6px 16px", 
              borderRadius: "6px", 
              fontWeight: "500",
              fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem"
            }}
          >
            Close
          </Button>
          {selectedQuotation && (
            <>
              <Button 
                variant="success" 
                onClick={() => sendWhatsApp(selectedQuotation)}
                style={{ 
                  padding: windowWidth <= 768 ? "6px 12px" : "6px 16px", 
                  borderRadius: "6px", 
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem"
                }}
              >
                <MessageCircle size={windowWidth <= 768 ? 14 : 16} />
                {windowWidth > 768 && "WhatsApp"}
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handlePrintQuotation(selectedQuotation)}
                style={{ 
                  padding: windowWidth <= 768 ? "6px 12px" : "6px 16px", 
                  borderRadius: "6px", 
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem"
                }}
              >
                <Printer size={windowWidth <= 768 ? 14 : 16} />
                {windowWidth > 768 ? "Print Q" : "Print Q"}
              </Button>
              <Button 
                variant="warning" 
                onClick={() => handlePrintInvoice(selectedQuotation)}
                style={{ 
                  padding: windowWidth <= 768 ? "6px 12px" : "6px 16px", 
                  borderRadius: "6px", 
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem"
                }}
              >
                <Printer size={windowWidth <= 768 ? 14 : 16} />
                {windowWidth > 768 ? "Print INV" : "Print INV"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Quotation Modal */}
      <Modal 
        show={showModal} 
        onHide={() => {
          setShowModal(false);
          resetForm();
        }}
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
        fullscreen={windowWidth <= 768 ? true : undefined}
      >
        <Modal.Header closeButton style={{ 
          borderBottom: "1px solid #e0e0e0", 
          backgroundColor: "#007bff", 
          color: "white",
          padding: windowWidth <= 768 ? "12px 15px" : "15px 25px"
        }}>
          <Modal.Title style={{ fontSize: windowWidth <= 768 ? "1rem" : "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px" }}>
            {editId ? <Edit size={windowWidth <= 768 ? 18 : 20} /> : <PlusCircle size={windowWidth <= 768 ? 18 : 20} />}
            {editId ? "Edit Quotation" : "Create New Quotation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: windowWidth <= 768 ? "none" : "70vh", overflowY: "auto", padding: windowWidth <= 768 ? "15px" : "25px" }}>
          {error && (
            <Alert variant="danger" style={{ marginBottom: "20px" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" style={{ marginBottom: "20px" }}>
              {success}
            </Alert>
          )}
          <Form>
            {/* Customer Details Section */}
            <div style={{ marginBottom: "25px" }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: "15px", 
                paddingBottom: "10px", 
                borderBottom: "2px solid #f0f0f0" 
              }}>
                <div style={{ 
                  width: windowWidth <= 768 ? "32px" : "40px", 
                  height: windowWidth <= 768 ? "32px" : "40px", 
                  borderRadius: "8px", 
                  backgroundColor: "#007bff", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  marginRight: "12px",
                  color: "white",
                  fontSize: windowWidth <= 768 ? "1rem" : "1.2rem"
                }}>
                  👤
                </div>
                <h6 style={{ color: "#495057", margin: 0, fontSize: windowWidth <= 768 ? "0.9rem" : "1rem", fontWeight: "600" }}>
                  Customer Details
                </h6>
              </div>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem", fontWeight: "500", color: "#495057", marginBottom: "5px" }}>
                      Bill To <span style={{ color: "#dc3545" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="billTo"
                      value={customerInfo.billTo}
                      onChange={handleCustomerChange}
                      placeholder="Enter customer name"
                      size="sm"
                      required
                      style={{ padding: windowWidth <= 768 ? "6px 10px" : "8px 12px", borderRadius: "6px", fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem" }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem", fontWeight: "500", color: "#495057", marginBottom: "5px" }}>
                      Contact No <span style={{ color: "#dc3545" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="contactNo"
                      value={customerInfo.contactNo}
                      onChange={handleCustomerChange}
                      placeholder="Enter phone number"
                      size="sm"
                      required
                      style={{ padding: windowWidth <= 768 ? "6px 10px" : "8px 12px", borderRadius: "6px", fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem" }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem", fontWeight: "500", color: "#495057", marginBottom: "5px" }}>State Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="stateName"
                      value={customerInfo.stateName}
                      onChange={handleCustomerChange}
                      placeholder="Enter state name"
                      size="sm"
                      style={{ padding: windowWidth <= 768 ? "6px 10px" : "8px 12px", borderRadius: "6px", fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem" }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem", fontWeight: "500", color: "#495057", marginBottom: "5px" }}>Customer GSTIN</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerGstin"
                      value={customerInfo.customerGstin}
                      onChange={handleCustomerChange}
                      placeholder="Enter customer GSTIN"
                      size="sm"
                      style={{ padding: windowWidth <= 768 ? "6px 10px" : "8px 12px", borderRadius: "6px", fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem" }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem", fontWeight: "500", color: "#495057", marginBottom: "5px" }}>Estimate No</Form.Label>
                    <Form.Control
                      type="text"
                      name="estimateNo"
                      value={customerInfo.estimateNo}
                      onChange={handleCustomerChange}
                      placeholder="Enter estimate number"
                      size="sm"
                      style={{ padding: windowWidth <= 768 ? "6px 10px" : "8px 12px", borderRadius: "6px", fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem" }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem", fontWeight: "500", color: "#495057", marginBottom: "5px" }}>Estimate Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="estimateDate"
                      value={customerInfo.estimateDate}
                      onChange={handleCustomerChange}
                      size="sm"
                      style={{ padding: windowWidth <= 768 ? "6px 10px" : "8px 12px", borderRadius: "6px", fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem" }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Items Section */}
            <div style={{ marginBottom: "25px" }}>
              <div style={{ 
                display: "flex", 
                flexDirection: windowWidth <= 768 ? "column" : "row",
                justifyContent: "space-between", 
                alignItems: windowWidth <= 768 ? "flex-start" : "center", 
                marginBottom: "15px", 
                paddingBottom: "10px", 
                borderBottom: "2px solid #f0f0f0",
                gap: windowWidth <= 768 ? "10px" : "0"
              }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ 
                    width: windowWidth <= 768 ? "32px" : "40px", 
                    height: windowWidth <= 768 ? "32px" : "40px", 
                    borderRadius: "8px", 
                    backgroundColor: "#28a745", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginRight: "12px",
                    color: "white"
                  }}>
                    📦
                  </div>
                  <h6 style={{ color: "#495057", margin: 0, fontSize: windowWidth <= 768 ? "0.9rem" : "1rem", fontWeight: "600" }}>
                    Items
                  </h6>
                </div>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={addItem}
                  style={{ 
                    padding: windowWidth <= 768 ? "6px 12px" : "6px 14px", 
                    borderRadius: "6px", 
                    fontSize: windowWidth <= 768 ? "0.8rem" : "0.85rem", 
                    fontWeight: "500",
                    borderWidth: "1px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    width: windowWidth <= 768 ? "100%" : "auto",
                    justifyContent: "center"
                  }}
                >
                  <PlusCircle size={windowWidth <= 768 ? 14 : 14} />
                  Add Item
                </Button>
              </div>
              
              <div style={{ overflowX: "auto" }}>
                <Table bordered hover size="sm" style={{ marginBottom: "0", minWidth: "600px" }}>
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600", width: "50px" }}>S.No</th>
                      <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600", minWidth: "250px" }}>Description</th>
                      <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600", width: "100px" }}>Qty</th>
                      <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600", width: "120px" }}>Rate (₹)</th>
                      <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600", width: "120px" }}>Amount (₹)</th>
                      <th style={{ padding: "10px 12px", fontSize: windowWidth <= 768 ? "0.75rem" : "0.85rem", color: "#495057", fontWeight: "600", width: "80px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#6c757d", fontWeight: "500", verticalAlign: "middle" }}>
                          {i + 1}
                        </td>
                        <td style={{ padding: "10px 12px", verticalAlign: "middle", position: "relative" }}>
                          <Form.Control
                            value={item.description}
                            onChange={(e) => handleDescriptionSearch(i, e.target.value)}
                            onFocus={() => {
                              if (searchTerms[i]?.length >= 2) {
                                setShowSuggestions({ ...showSuggestions, [i]: true });
                              }
                            }}
                            onBlur={() => {
                              setTimeout(() => {
                                setShowSuggestions({ ...showSuggestions, [i]: false });
                              }, 200);
                            }}
                            size="sm"
                            placeholder="Type to search from inventory or enter new"
                            style={{ padding: windowWidth <= 768 ? "6px 8px" : "8px 10px", borderRadius: "6px", fontSize: windowWidth <= 768 ? "0.8rem" : "0.85rem" }}
                            required
                          />
                          {showSuggestions[i] && (
                            <div style={{
                              position: "absolute",
                              top: "100%",
                              left: "12px",
                              right: "12px",
                              backgroundColor: "white",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              maxHeight: "200px",
                              overflowY: "auto",
                              zIndex: 1000,
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                            }}>
                              {inventoryItems
                                .filter(inv => 
                                  inv.description.toLowerCase().includes(searchTerms[i]?.toLowerCase() || "")
                                )
                                .map(inv => (
                                  <div
                                    key={inv.id}
                                    style={{
                                      padding: "8px 12px",
                                      cursor: "pointer",
                                      borderBottom: "1px solid #eee",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      fontSize: windowWidth <= 768 ? "0.8rem" : "0.85rem"
                                    }}
                                    onMouseDown={() => handleSelectInventoryItem(i, inv)}
                                  >
                                    <span>{inv.description}</span>
                                    <span style={{ color: "#28a745", fontWeight: "600" }}>
                                      ₹{inv.rate.toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              {inventoryItems.filter(inv => 
                                inv.description.toLowerCase().includes(searchTerms[i]?.toLowerCase() || "")
                              ).length === 0 && (
                                <div style={{ padding: "8px 12px", color: "#6c757d", fontStyle: "italic", fontSize: windowWidth <= 768 ? "0.8rem" : "0.85rem" }}>
                                  No matching items found. You can enter new description.
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "10px 12px", verticalAlign: "middle" }}>
                          <Form.Control
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleItemChange(i, "qty", e.target.value)}
                            size="sm"
                            placeholder="Qty"
                            min="1"
                            style={{ padding: windowWidth <= 768 ? "6px 8px" : "8px 10px", borderRadius: "6px", fontSize: windowWidth <= 768 ? "0.8rem" : "0.85rem" }}
                            required
                          />
                        </td>
                        <td style={{ padding: "10px 12px", verticalAlign: "middle" }}>
                          <Form.Control
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(i, "rate", e.target.value)}
                            size="sm"
                            placeholder="Rate"
                            min="0"
                            step="0.01"
                            style={{ padding: windowWidth <= 768 ? "6px 8px" : "8px 10px", borderRadius: "6px", fontSize: windowWidth <= 768 ? "0.8rem" : "0.85rem" }}
                            required
                          />
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: "#28a745", fontWeight: "600", verticalAlign: "middle", fontSize: windowWidth <= 768 ? "0.8rem" : "0.85rem" }}>
                          ₹{item.amount.toFixed(2)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center", verticalAlign: "middle" }}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeItem(i)}
                            disabled={items.length <= 1}
                            style={{ 
                              padding: windowWidth <= 768 ? "4px 6px" : "4px 8px", 
                              borderRadius: "6px",
                              borderWidth: "1px"
                            }}
                            title="Remove item"
                          >
                            <Trash2 size={windowWidth <= 768 ? 12 : 14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* Totals Preview */}
            <div style={{ 
              backgroundColor: "#f8f9fa", 
              padding: windowWidth <= 768 ? "15px" : "20px", 
              borderRadius: "8px", 
              border: "1px solid #e9ecef",
              marginTop: "20px"
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: "15px", 
                paddingBottom: "10px", 
                borderBottom: "1px solid #dee2e6" 
              }}>
                <div style={{ 
                  width: windowWidth <= 768 ? "32px" : "40px", 
                  height: windowWidth <= 768 ? "32px" : "40px", 
                  borderRadius: "8px", 
                  backgroundColor: "#6c757d", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  marginRight: "12px",
                  color: "white"
                }}>
                  ₹
                </div>
                <h6 style={{ color: "#495057", margin: 0, fontSize: windowWidth <= 768 ? "0.9rem" : "1rem", fontWeight: "600" }}>
                  Totals Summary
                </h6>
              </div>
              
              <Row>
                <Col md={8}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    padding: windowWidth <= 768 ? "10px 12px" : "12px 15px", 
                    backgroundColor: "#e3f2fd", 
                    borderRadius: "6px",
                    marginTop: "10px",
                    border: "2px solid #007bff"
                  }}>
                    <h5 style={{ color: "#007bff", margin: 0, fontWeight: "700", fontSize: windowWidth <= 768 ? "1rem" : "1.2rem" }}>Total Amount:</h5>
                    <h5 style={{ color: '#007bff', margin: 0, fontWeight: "700", fontSize: windowWidth <= 768 ? "1rem" : "1.2rem" }}>₹{grandTotal.toFixed(2)}</h5>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #e0e0e0", padding: windowWidth <= 768 ? "12px 15px" : "15px 25px" }}>
          <Button 
            variant="light" 
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
            size="sm"
            style={{ 
              padding: windowWidth <= 768 ? "6px 12px" : "6px 16px", 
              borderRadius: "6px", 
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem"
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            size="sm"
            disabled={saving || !customerInfo.billTo || !customerInfo.contactNo}
            style={{ 
              padding: windowWidth <= 768 ? "6px 16px" : "6px 20px", 
              borderRadius: "6px", 
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: windowWidth <= 768 ? "0.85rem" : "0.9rem"
            }}
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" />
                {editId ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                {editId ? "Update Quotation" : "Save Quotation"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuotationPage;