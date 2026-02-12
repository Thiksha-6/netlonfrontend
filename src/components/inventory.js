import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/inventory";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    rate: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/`);
    const data = await res.json();
    setItems(data);
  };

  /* ================= ADD ================= */
  const handleAdd = () => {
    setFormData({ description: "", rate: "" });
    setEditingItem(null);
    setShowModal(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setFormData({
      description: item.description,
      rate: item.rate,
    });
    setEditingItem(item);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchItems();
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!formData.description || !formData.rate) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      description: formData.description,
      rate: parseFloat(formData.rate),
    };

    if (editingItem) {
      // UPDATE
      await fetch(`${API_URL}/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // CREATE
      await fetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setShowModal(false);
    fetchItems();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>📦 Inventory</h2>
          <button style={styles.addBtn} onClick={handleAdd}>
            + Add
          </button>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Rate (₹)</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="3" style={styles.empty}>
                    <span style={styles.emptyIcon}>📭</span>
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.itemDesc}>{item.description}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.itemRate}>₹{item.rate}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionGroup}>
                        <button
                          style={styles.editBtn}
                          onClick={() => handleEdit(item)}
                          aria-label="Edit item"
                        >
                          ✏️
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(item.id)}
                          aria-label="Delete item"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingItem ? "✏️ Edit Item" : "➕ Add New Item"}
              </h3>
              <button 
                style={styles.closeBtn}
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={styles.input}
                  placeholder="Enter item description"
                  autoFocus
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Rate (₹)</label>
                <input
                  type="number"
                  value={formData.rate}
                  onChange={(e) =>
                    setFormData({ ...formData, rate: e.target.value })
                  }
                  style={styles.input}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button style={styles.saveBtn} onClick={handleSave}>
                {editingItem ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    background: "linear-gradient(145deg, #f8fafc 0%, #eef2f6 100%)",
    minHeight: "100vh",
    padding: "16px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    boxSizing: "border-box",
  },
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.02)",
    maxWidth: "1200px",
    margin: "0 auto",
    transition: "all 0.2s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    margin: 0,
    fontSize: "clamp(1.2rem, 5vw, 1.6rem)",
    fontWeight: "600",
    color: "#1a2634",
    letterSpacing: "-0.01em",
  },
  addBtn: {
    background: "#2a5c8a",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 6px rgba(42,92,138,0.2)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    lineHeight: 1,
  },
  tableContainer: {
    overflowX: "auto",
    margin: "0 -4px",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 6px",
    minWidth: "400px",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    background: "#f3f6fa",
    color: "#2c3e50",
    fontWeight: "600",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    borderBottom: "2px solid #e1e9f0",
  },
  tr: {
    transition: "all 0.2s ease",
  },
  td: {
    padding: "14px 16px",
    background: "#fff",
    borderBottom: "1px solid #edf2f7",
    fontSize: "0.95rem",
  },
  itemDesc: {
    color: "#1a2634",
    fontWeight: "500",
  },
  itemRate: {
    color: "#2a5c8a",
    fontWeight: "600",
  },
  actionGroup: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  editBtn: {
    background: "transparent",
    border: "none",
    padding: "4px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#2a5c8a",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    padding: "4px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#b22234",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },
  empty: {
    textAlign: "center",
    padding: "32px 16px",
    color: "#5f6c80",
    fontSize: "0.95rem",
    background: "#fff",
    borderRadius: "12px",
  },
  emptyIcon: {
    display: "block",
    fontSize: "2rem",
    marginBottom: "8px",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    width: "100%",
    maxWidth: "380px",
    borderRadius: "24px",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    animation: "slideIn 0.2s ease",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#1a2634",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#5f6c80",
    padding: "4px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },
  modalBody: {
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#2c3e50",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #e1e9f0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    background: "#fafcfc",
    boxSizing: "border-box",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },
  saveBtn: {
    background: "#2a5c8a",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 6px rgba(42,92,138,0.2)",
    lineHeight: 1,
  },
  cancelBtn: {
    background: "transparent",
    color: "#5f6c80",
    border: "1.5px solid #e1e9f0",
    padding: "8px 16px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    lineHeight: 1,
  },
};

export default Inventory;