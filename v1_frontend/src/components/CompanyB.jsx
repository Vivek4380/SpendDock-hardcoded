import React, { useState, useEffect } from "react";

export default function CompanyB() {
  const [isDark, setIsDark] = useState(true);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("http://localhost:8080/client/invoices");
      const data = await res.json();
      console.log("Fetched invoices:", data);
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  const handleReview = async (invoiceId, status) => {
    try {
      const res = await fetch("http://localhost:8080/client/review", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId: invoiceId,
          status: status,
          comment:
            status === "ACCEPTED"
              ? "Approved by client"
              : "Rejected by client",
        }),
      });

      if (!res.ok) throw new Error("Review failed");

      fetchInvoices(); // refresh list
    } catch (err) {
      console.error("Review error:", err);
      alert("Review failed");
    }
  };

  // ✅ NEW: Handle Payment
  const handlePayment = async (invoiceId) => {
    try {
      const res = await fetch("http://localhost:8080/client/payment", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId: invoiceId,
          paymentStatus: "PAID",
        }),
      });

      if (!res.ok) throw new Error("Payment failed");

      fetchInvoices(); // refresh list
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>
      
      {/* HEADER */}
      <div className="p-6 flex justify-between items-center border-b">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"}`}>
            Client Portal
          </h1>
          <p className={`${isDark ? "text-white/60" : "text-black/60"}`}>
            AI-Powered Invoice Review
          </p>
        </div>

        <button
          onClick={() => setIsDark(!isDark)}
          className="px-4 py-2 border rounded"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* AI ASSISTANT BANNER */}
      <div
        className={`m-6 p-6 rounded-xl border ${
          isDark
            ? "bg-purple-900/20 border-purple-500/30 text-white"
            : "bg-purple-100 border-purple-300 text-black"
        }`}
      >
        <h3 className="text-xl font-bold mb-2">🤖 AI Invoice Assistant</h3>
        <p className="text-sm opacity-80">
          AI extracts invoice data and predicts confidence before approval.
        </p>
      </div>

      {/* INVOICE LIST */}
      <div className="p-6 space-y-6">
        {invoices.length === 0 ? (
          <p className={`${isDark ? "text-white" : "text-black"}`}>
            No invoices available.
          </p>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`p-6 rounded-xl border ${
                isDark
                  ? "bg-white/5 border-white/10 text-white"
                  : "bg-black/5 border-black/10 text-black"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {invoice.invoiceNumber}
                  </h2>
                  <p className="text-sm opacity-70">
                    Vendor: {invoice.vendorName}
                  </p>
                  <p className="text-sm opacity-70">
                    Date: {invoice.invoiceDate}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ₹ {invoice.grandTotal}
                  </p>
                  <p className="text-sm mt-1">
                    Review Status: {invoice.reviewStatus}
                  </p>
                  <p className="text-sm">
                    Payment Status: {invoice.paymentStatus}
                  </p>

                  <span className="mt-2 inline-block px-3 py-1 text-xs rounded-full bg-green-600 text-white">
                    AI Confidence: 98%
                  </span>
                </div>
              </div>

              {/* ✅ Conditional Buttons */}

              {invoice.reviewStatus === "PENDING" && (
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => handleReview(invoice.id, "ACCEPTED")}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReview(invoice.id, "REJECTED")}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {invoice.reviewStatus === "ACCEPTED" &&
                invoice.paymentStatus === "PENDING" && (
                  <div className="mt-4">
                    <button
                      onClick={() => handlePayment(invoice.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Mark Paid
                    </button>
                  </div>
                )}

              {invoice.paymentStatus === "PAID" && (
                <div className="mt-4 text-green-400 font-semibold">
                  ✅ Payment Completed
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}