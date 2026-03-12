import React, { useState, useEffect } from "react";
import { fetchVendorInvoices, uploadInvoice, fetchVendorStats } from "../services/api";
import { supabase } from "../services/supabaseClient";

export default function VendorPortal() {
  const companyId = localStorage.getItem("companyId");
  const role = localStorage.getItem("role");
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const fetchInvoices = async () => {
    try {
      const data = await fetchVendorInvoices(companyId);
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await fetchVendorStats(companyId);
      setStatsData(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchStats();
    // Get email from Supabase session for Settings tab
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  const stats = statsData
    ? [
        { label: "Sent Invoices", value: statsData.totalInvoices, subtext: "Total uploaded", icon: "📤" },
        { label: "Pending Review", value: statsData.pendingInvoices, subtext: "Awaiting approval", icon: "⏳" },
        { label: "Approved", value: statsData.acceptedInvoices, subtext: "Ready for payment", icon: "✓" },
        { label: "Total Value", value: "₹ " + statsData.totalValue, subtext: "Invoice value", icon: "💰" },
      ]
    : [
        { label: "Sent Invoices", value: "...", subtext: "Loading", icon: "📤" },
        { label: "Pending Review", value: "...", subtext: "Loading", icon: "⏳" },
        { label: "Approved", value: "...", subtext: "Loading", icon: "✓" },
        { label: "Total Value", value: "...", subtext: "Loading", icon: "💰" },
      ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid": return isDark ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-green-100 text-green-700 border-green-300";
      case "approved": return isDark ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-blue-100 text-blue-700 border-blue-300";
      case "pending": return isDark ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "processing": return isDark ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-purple-100 text-purple-700 border-purple-300";
      default: return isDark ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-600";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) { alert("Please select a PDF file first"); return; }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      setUploading(true);
      await uploadInvoice(formData);
      alert("Invoice uploaded successfully!");
      setSelectedFile(null);
      await fetchInvoices();
      await fetchStats();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Check backend.");
    } finally {
      setUploading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) { alert("Please enter accountant email"); return; }
    try {
      setInviteLoading(true);
      const res = await fetch("http://localhost:8080/manager/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, companyId: companyId })
      });
      if (!res.ok) throw new Error("Invite failed");
      await res.json();
      alert("Invitation email sent to accountant.");
      setInviteEmail("");
    } catch (err) {
      console.error(err);
      alert("Failed to send invite.");
    } finally {
      setInviteLoading(false);
    }
  };

  // ── Analytics: compute derived stats from real data ──
  const paidInvoices = invoices.filter(i => i.paymentStatus === "PAID");
  const pendingInvoices = invoices.filter(i => i.reviewStatus === "PENDING");
  const acceptedInvoices = invoices.filter(i => i.reviewStatus === "ACCEPTED");
  const rejectedInvoices = invoices.filter(i => i.reviewStatus === "REJECTED");
  const totalPaidValue = paidInvoices.reduce((sum, i) => sum + Number(i.grandTotal || 0), 0);
  const approvalRate = invoices.length > 0
    ? Math.round((acceptedInvoices.length / invoices.length) * 100)
    : 0;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>

      {/* Top Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center shadow-lg cursor-pointer">
                <span className={`font-bold text-xl ${isDark ? "text-black" : "text-white"}`}>S</span>
              </div>
              <div>
                <span className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>SpendDock</span>
                <p className={`text-xs ${isDark ? "text-white/50" : "text-black/50"}`}>Vendor Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme toggle — notification button removed */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2.5 rounded-xl backdrop-blur-xl ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"} transition border ${isDark ? "border-white/20" : "border-black/20"}`}
              >
                <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
              </button>

              <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl backdrop-blur-xl ${isDark ? "bg-white/10" : "bg-black/10"} border ${isDark ? "border-white/20" : "border-black/20"}`}>
                <div className={`w-9 h-9 rounded-lg ${isDark ? "bg-white/20" : "bg-black/20"} flex items-center justify-center`}>
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>Tech Solutions Inc.</p>
                  <p className={`text-xs ${isDark ? "text-white/50" : "text-black/50"}`}>
                    {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Vendor"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`fixed left-0 w-72 h-[calc(100vh-64px)] backdrop-blur-xl ${isDark ? "bg-white/5" : "bg-black/5"} border-r ${isDark ? "border-white/10" : "border-black/10"} p-6`}>
          <nav className="space-y-2">
            {[
              { id: "dashboard", icon: "📊", label: "Dashboard" },
              { id: "invoices", icon: "📄", label: "My Invoices" },
              { id: "upload", icon: "📤", label: "Upload New" },
              { id: "payments", icon: "💳", label: "Payments" },
              { id: "analytics", icon: "📈", label: "Analytics" },
              { id: "settings", icon: "⚙️", label: "Settings" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition ${
                  activeTab === item.id
                    ? (isDark ? "bg-white text-black shadow-lg" : "bg-black text-white shadow-lg")
                    : isDark ? "text-white/70 hover:bg-white/10" : "text-black/70 hover:bg-black/10"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className={`mt-8 p-6 rounded-2xl backdrop-blur-xl ${isDark ? "bg-white/10" : "bg-black/10"} border ${isDark ? "border-white/20" : "border-black/20"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-black/80"}`}>AI Status</span>
              <span className={`text-xs px-2 py-1 rounded-full ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>Active</span>
            </div>
            <div className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"} mb-2`}>98.5%</div>
            <p className={`text-xs ${isDark ? "text-white/50" : "text-black/50"} mb-3`}>Processing Accuracy</p>
            <div className={`h-2 rounded-full ${isDark ? "bg-white/20" : "bg-black/20"} overflow-hidden`}>
              <div className={`h-full ${isDark ? "bg-white" : "bg-black"} rounded-full`} style={{ width: "98.5%" }}></div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-8">
          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${isDark ? "text-white" : "text-black"} mb-2`}>Welcome back, Tech Solutions</h1>
            <p className={`text-lg ${isDark ? "text-white/60" : "text-black/60"}`}>Track your invoices and manage payments</p>
          </div>

          {/* ── Dashboard ── */}
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className={`backdrop-blur-xl ${isDark ? "bg-white/5" : "bg-black/5"} rounded-2xl p-6 border ${isDark ? "border-white/10" : "border-black/10"} transition transform hover:-translate-y-1 cursor-pointer`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{stat.icon}</span>
                    </div>
                    <div className={`text-sm font-medium ${isDark ? "text-white/60" : "text-black/60"} mb-2`}>{stat.label}</div>
                    <div className={`text-4xl font-bold ${isDark ? "text-white" : "text-black"} mb-1`}>{stat.value}</div>
                    <div className={`text-xs ${isDark ? "text-white/40" : "text-black/40"}`}>{stat.subtext}</div>
                  </div>
                ))}
              </div>

              {/* Invite Accountant — only visible to manager */}
              {role === "manager" && (
                <div className={`backdrop-blur-xl ${isDark ? "bg-white/5" : "bg-black/5"} rounded-2xl p-6 border ${isDark ? "border-white/10" : "border-black/10"} mb-6`}>
                  <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-black"}`}>Invite Accountant</h2>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Accountant email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className={`border p-2 rounded w-72 ${isDark ? "bg-black text-white border-white/20" : "bg-white text-black"}`}
                    />
                    <button
                      onClick={handleInvite}
                      disabled={inviteLoading}
                      className={`px-4 py-2 rounded font-medium ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
                    >
                      {inviteLoading ? "Sending..." : "Invite Accountant"}
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className={`backdrop-blur-xl ${isDark ? "bg-white/5" : "bg-black/5"} rounded-2xl border ${isDark ? "border-white/10" : "border-black/10"} overflow-hidden mb-8`}>
                <div className="p-6 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>Recent Invoice Activity</h3>
                  </div>
                </div>
                <div className="divide-y divide-white/10">
                  {invoices.slice(0, 6).map((invoice) => (
                    <div key={invoice.id} className="p-6 transition cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 rounded-xl ${isDark ? "bg-white/10" : "bg-black/10"} flex items-center justify-center`}>
                            <span className="text-2xl">📄</span>
                          </div>
                          <div>
                            <div className={`font-bold ${isDark ? "text-white" : "text-black"} text-lg mb-1`}>{invoice.invoiceNumber}</div>
                            <div className={`text-sm ${isDark ? "text-white/60" : "text-black/60"} flex items-center space-x-3`}>
                              <span>{invoice.vendorName}</span>
                              <span>•</span>
                              <span>{invoice.invoiceDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>₹ {invoice.grandTotal}</div>
                          <div className={`px-4 py-2 rounded-xl border ${getStatusColor(invoice.reviewStatus)} font-medium text-sm capitalize`}>{invoice.reviewStatus}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Upload ── */}
          {activeTab === "upload" && (
            <div className={`backdrop-blur-xl ${isDark ? "bg-gradient-to-br from-white/10 to-white/5" : "bg-gradient-to-br from-black/10 to-black/5"} rounded-2xl p-8 border ${isDark ? "border-white/20" : "border-black/20"} mb-8`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"} mb-2`}>📤 Send New Invoice</h3>
                  <p className={`${isDark ? "text-white/60" : "text-black/60"}`}>Upload your invoice and let AI handle the extraction</p>
                </div>
                <div className="flex items-center space-x-4">
                  <input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
                  <label htmlFor="file-upload" className="px-4 py-2 bg-white text-black rounded-lg cursor-pointer">Choose PDF</label>
                  <div className={`${isDark ? "text-white/80" : "text-black/80"} text-sm`}>
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </div>
                  <button onClick={handleUpload} disabled={uploading} className="px-6 py-3 bg-black text-white rounded-xl font-medium transition">
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── My Invoices ── */}
          {activeTab === "invoices" && (
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <p className={`${isDark ? "text-white" : "text-black"}`}>No invoices available.</p>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className={`p-6 rounded-xl border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"}`}>
                    <div className="flex justify-between">
                      <div>
                        <div className="font-bold text-lg">{inv.invoiceNumber}</div>
                        <div className="text-sm opacity-70">Vendor: {inv.vendorName}</div>
                        <div className="text-sm opacity-70">Date: {inv.invoiceDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₹ {inv.grandTotal}</div>
                        <div className="text-sm mt-1">Status: {inv.reviewStatus}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Payments ── */}
          {activeTab === "payments" && (
            <div>
              <h2 className={`text-2xl mb-4 font-bold ${isDark ? "text-white" : "text-black"}`}>Paid Invoices</h2>
              {invoices.filter(i => i.paymentStatus === "PAID").length === 0 ? (
                <p className={`${isDark ? "text-white" : "text-black"}`}>No paid invoices yet.</p>
              ) : (
                invoices.filter(i => i.paymentStatus === "PAID").map(i => (
                  <div key={i.id} className={`p-4 mb-3 rounded-lg ${isDark ? "bg-white/5 text-white" : "bg-black/5 text-black"}`}>
                    <div className="flex justify-between">
                      <div>{i.invoiceNumber} • {i.vendorName}</div>
                      <div>₹ {i.grandTotal}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Analytics ── */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"}`}>Analytics Overview</h2>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "Approval Rate", value: approvalRate + "%", icon: "✅", color: "text-green-400" },
                  { label: "Total Paid Value", value: "₹ " + totalPaidValue.toLocaleString(), icon: "💰", color: "text-blue-400" },
                  { label: "Rejected Invoices", value: rejectedInvoices.length, icon: "❌", color: "text-red-400" },
                ].map((card, i) => (
                  <div key={i} className={`p-6 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
                    <div className="text-3xl mb-3">{card.icon}</div>
                    <div className={`text-sm ${isDark ? "text-white/60" : "text-black/60"} mb-1`}>{card.label}</div>
                    <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                  </div>
                ))}
              </div>

              {/* Invoice breakdown bar */}
              <div className={`p-6 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>Invoice Status Breakdown</h3>
                {invoices.length === 0 ? (
                  <p className={`text-sm ${isDark ? "text-white/50" : "text-black/50"}`}>No data yet.</p>
                ) : (
                  <div className="space-y-4">
                    {[
                      { label: "Pending", count: pendingInvoices.length, color: "bg-yellow-400" },
                      { label: "Accepted", count: acceptedInvoices.length, color: "bg-green-400" },
                      { label: "Rejected", count: rejectedInvoices.length, color: "bg-red-400" },
                      { label: "Paid", count: paidInvoices.length, color: "bg-blue-400" },
                    ].map((row, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-black/80"}`}>{row.label}</span>
                          <span className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>{row.count} invoice{row.count !== 1 ? "s" : ""}</span>
                        </div>
                        <div className={`h-3 rounded-full ${isDark ? "bg-white/10" : "bg-black/10"} overflow-hidden`}>
                          <div
                            className={`h-full rounded-full ${row.color} transition-all duration-700`}
                            style={{ width: invoices.length > 0 ? `${(row.count / invoices.length) * 100}%` : "0%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Performance card */}
              <div className={`p-6 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>🤖 AI Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Extraction Accuracy", value: "98.5%" },
                    { label: "Avg. Processing Time", value: "1.2s" },
                    { label: "Invoices Processed", value: invoices.length },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                      <div className={`text-xs ${isDark ? "text-white/50" : "text-black/50"} mb-1`}>{item.label}</div>
                      <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Settings ── */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"}`}>Settings</h2>

              {/* Profile card */}
              <div className={`p-6 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>👤 Profile Information</h3>
                <div className="space-y-4">
                  {[
                    { label: "Company Name", value: "Tech Solutions Inc." },
                    { label: "Email", value: userEmail || "Loading..." },
                    { label: "Role", value: role ? role.charAt(0).toUpperCase() + role.slice(1) : "—" },
                    { label: "Portal", value: "Vendor Portal" },
                  ].map((field, i) => (
                    <div key={i} className={`flex justify-between items-center py-3 border-b ${isDark ? "border-white/10" : "border-black/10"}`}>
                      <span className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>{field.label}</span>
                      <span className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* App settings card */}
              <div className={`p-6 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>🎨 Appearance</h3>
                <div className={`flex justify-between items-center py-3`}>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>Dark Mode</p>
                    <p className={`text-xs ${isDark ? "text-white/50" : "text-black/50"}`}>Toggle between dark and light theme</p>
                  </div>
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={`w-12 h-6 rounded-full transition-colors duration-300 ${isDark ? "bg-white" : "bg-black"} relative`}
                  >
                    <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-all duration-300 ${isDark ? "bg-black right-0.5" : "bg-white left-0.5"}`} />
                  </button>
                </div>
              </div>

              {/* System info card */}
              <div className={`p-6 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>ℹ️ System Information</h3>
                <div className="space-y-3">
                  {[
                    { label: "Version", value: "1.0.0" },
                    { label: "Backend", value: "Spring Boot" },
                    { label: "Auth", value: "Supabase" },
                    { label: "AI Engine", value: "Active · 98.5% accuracy" },
                  ].map((item, i) => (
                    <div key={i} className={`flex justify-between items-center py-2 border-b ${isDark ? "border-white/10" : "border-black/10"}`}>
                      <span className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>{item.label}</span>
                      <span className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}