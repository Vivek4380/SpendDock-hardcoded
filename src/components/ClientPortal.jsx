import React, { useState, useEffect } from "react";
import {
  fetchClientInvoices,
  reviewInvoice,
  markInvoicePaid
} from "../services/api";

export default function ClientPortal() {
  const [isDark, setIsDark] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);
  // Steps: 0 = connecting, 1 = processing, 2 = success

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await fetchClientInvoices();
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  const handleReview = async (invoiceId, status) => {
    try {
      await reviewInvoice(
        invoiceId,
        status,
        status === "ACCEPTED" ? "Approved by client" : "Rejected by client"
      );
      fetchInvoices();
    } catch (err) {
      console.error("Review error:", err);
      alert("Review failed");
    }
  };

  const handleMarkPaid = (invoiceId) => {
    setPaymentStep(0);
    setShowGatewayModal(true);

    // Step 1 — connecting
    setTimeout(() => {
      setPaymentStep(1); // processing
    }, 1000);

    // Step 2 — call backend + show success
    setTimeout(async () => {
      try {
        await markInvoicePaid(invoiceId);
        setPaymentStep(2); // success
        await fetchInvoices();
      } catch (err) {
        console.error("Payment error:", err);
        alert("Payment failed");
        setShowGatewayModal(false);
      }
    }, 2000);

    // Step 3 — close modal
    setTimeout(() => {
      setShowGatewayModal(false);
      setPaymentStep(0);
    }, 3500);
  };

  const stepLabels = [
    { icon: "🔗", text: "Connecting to Payment Gateway..." },
    { icon: "⚙️", text: "Processing Payment Securely..." },
    { icon: "✅", text: "Payment Successful!" },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>

      {/* ── Spinner CSS ── */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {/* ── Payment Gateway Modal ── */}
      {showGatewayModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "40px 36px",
            width: "380px",
            textAlign: "center",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            animation: "fadeIn 0.3s ease"
          }}>

            {/* Gateway branding */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #1a56db, #0e9f6e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px"
              }}>🏦</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "700", fontSize: "15px", color: "#111827" }}>
                  RazorPay Gateway
                </div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>
                  Secure Payment Processing
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "#f3f4f6", marginBottom: "24px" }} />

            {/* Step icon */}
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>
              {stepLabels[paymentStep].icon}
            </div>

            {/* Step text */}
            <h2 style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "8px"
            }}>
              {stepLabels[paymentStep].text}
            </h2>

            {/* Spinner or success */}
            {paymentStep < 2 ? (
              <>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "24px" }}>
                  Please do not close this window
                </p>
                <div style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #e5e7eb",
                  borderTop: "4px solid #1a56db",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 24px"
                }} />

                {/* Animated progress bar */}
                <div style={{
                  height: "4px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "99px",
                  overflow: "hidden",
                  marginBottom: "20px"
                }}>
                  <div style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #1a56db, #0e9f6e)",
                    borderRadius: "99px",
                    animation: "progressBar 2s linear forwards"
                  }} />
                </div>
              </>
            ) : (
              <p style={{
                fontSize: "13px",
                color: "#059669",
                fontWeight: "600",
                marginBottom: "20px"
              }}>
                ₹ Amount has been debited successfully
              </p>
            )}

            {/* Steps indicator */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "6px",
              marginBottom: "20px"
            }}>
              {[0, 1, 2].map((step) => (
                <div key={step} style={{
                  width: step === paymentStep ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "99px",
                  backgroundColor: step <= paymentStep ? "#1a56db" : "#e5e7eb",
                  transition: "all 0.3s ease"
                }} />
              ))}
            </div>

            {/* Security badge */}
            <p style={{ fontSize: "11px", color: "#9ca3af" }}>
              🔒 256-bit SSL Encrypted · PCI DSS Compliant
            </p>
          </div>
        </div>
      )}

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
      <div className={`m-6 p-6 rounded-xl border ${
        isDark
          ? "bg-purple-900/20 border-purple-500/30 text-white"
          : "bg-purple-100 border-purple-300 text-black"
      }`}>
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
                  <h2 className="text-xl font-bold">{invoice.invoiceNumber}</h2>
                  <p className="text-sm opacity-70">Vendor: {invoice.vendorName}</p>
                  <p className="text-sm opacity-70">Date: {invoice.invoiceDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹ {invoice.grandTotal}</p>
                  <p className="text-sm mt-1">Review: {invoice.reviewStatus}</p>
                  <p className="text-sm">Payment: {invoice.paymentStatus}</p>
                  <span className="mt-2 inline-block px-3 py-1 text-xs rounded-full bg-green-600 text-white">
                    AI Confidence: 98%
                  </span>
                </div>
              </div>

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
                      onClick={() => handleMarkPaid(invoice.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded font-medium"
                    >
                      💳 Pay Now
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
