import React, { useState } from 'react';


export default function CompanyA() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

const [selectedFile, setSelectedFile] = useState(null);
const [uploading, setUploading] = useState(false);

  const stats = [
    { label: 'Sent Invoices', value: '47', subtext: 'This month', icon: '📤' },
    { label: 'Pending Review', value: '12', subtext: 'Awaiting approval', icon: '⏳' },
    { label: 'Approved', value: '32', subtext: 'Ready for payment', icon: '✓' },
    { label: 'Total Value', value: '$89K', subtext: 'Outstanding', icon: '💰' }
  ];

  const recentInvoices = [
    { id: 'INV-2024-0156', client: 'Enterprise Corp', amount: '$5,230', status: 'paid', date: '2 hours ago', confidence: 99 },
    { id: 'INV-2024-0157', client: 'Global Tech Ltd', amount: '$12,450', status: 'approved', date: '5 hours ago', confidence: 98 },
    { id: 'INV-2024-0158', client: 'StartupHub Inc', amount: '$3,890', status: 'pending', date: '1 day ago', confidence: 96 },
    { id: 'INV-2024-0159', client: 'Digital Solutions', amount: '$8,120', status: 'processing', date: '2 days ago', confidence: 97 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-300';
      case 'approved': return isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-300';
      case 'pending': return isDark ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'processing': return isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-300';
      default: return isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-600';
    }
  };

  const handleUpload = async () => {
  if (!selectedFile) {
    alert("Please select a PDF file first");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    setUploading(true);

    const response = await fetch("http://localhost:8080/vendor/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    console.log("Uploaded invoice:", data);

    alert("Invoice uploaded successfully!");
    setSelectedFile(null);
  } catch (error) {
    console.error("Upload error:", error);
    alert("Upload failed. Check backend.");
  } finally {
    setUploading(false);
  }
};

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Top Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center shadow-lg cursor-pointer">
                <span className={`font-bold text-xl ${isDark ? 'text-black' : 'text-white'}`}>S</span>
              </div>
              <div>
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>SpendDock</span>
                <p className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>Vendor Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className={`p-2.5 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition border ${isDark ? 'border-white/20' : 'border-black/20'}`}>
                <span className="text-lg">🔔</span>
              </button>
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2.5 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition border ${isDark ? 'border-white/20' : 'border-black/20'}`}
              >
                <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
              </button>
              <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/10' : 'bg-black/10'} border ${isDark ? 'border-white/20' : 'border-black/20'}`}>
                <div className={`w-9 h-9 rounded-lg ${isDark ? 'bg-white/20' : 'bg-black/20'} flex items-center justify-center`}>
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>Tech Solutions Inc.</p>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>Vendor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`fixed left-0 w-72 h-[calc(100vh-64px)] backdrop-blur-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} border-r ${isDark ? 'border-white/10' : 'border-black/10'} p-6`}>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'invoices', icon: '📄', label: 'My Invoices' },
              { id: 'upload', icon: '📤', label: 'Upload New' },
              { id: 'payments', icon: '💳', label: 'Payments' },
              { id: 'analytics', icon: '📈', label: 'Analytics' },
              { id: 'settings', icon: '⚙️', label: 'Settings' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition ${
                  activeTab === item.id
                    ? isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg'
                    : isDark ? 'text-white/70 hover:bg-white/10' : 'text-black/70 hover:bg-black/10'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className={`mt-8 p-6 rounded-2xl backdrop-blur-xl ${isDark ? 'bg-white/10' : 'bg-black/10'} border ${isDark ? 'border-white/20' : 'border-black/20'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-black/80'}`}>AI Status</span>
              <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>Active</span>
            </div>
            <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-2`}>98.5%</div>
            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'} mb-3`}>Processing Accuracy</p>
            <div className={`h-2 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/20'} overflow-hidden`}>
              <div className={`h-full ${isDark ? 'bg-white' : 'bg-black'} rounded-full`} style={{width: '98.5%'}}></div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-2`}>
              Welcome back, Tech Solutions
            </h1>
            <p className={`text-lg ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Track your invoices and manage payments
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`backdrop-blur-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-2xl p-6 border ${isDark ? 'border-white/10' : 'border-black/10'} hover:${isDark ? 'bg-white/10' : 'bg-black/10'} transition transform hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                </div>
                <div className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-black/60'} mb-2`}>
                  {stat.label}
                </div>
                <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-1`}>
                  {stat.value}
                </div>
                <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>

          {/* UPLOAD SECTION */}
          <div className={`backdrop-blur-xl ${isDark ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-gradient-to-br from-black/10 to-black/5'} rounded-2xl p-8 border ${isDark ? 'border-white/20' : 'border-black/20'} mb-8`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-2`}>
                  📤 Send New Invoice
                </h3>
                <p className={`${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  Upload your invoice and let AI handle the extraction
                </p>
              </div>
              <div className="flex space-x-4 items-center">
  <input
    type="file"
    accept=".pdf"
    onChange={(e) => setSelectedFile(e.target.files[0])}
    className="text-sm"
  />

  <button
    onClick={handleUpload}
    disabled={uploading}
    className="px-6 py-3 bg-black text-white rounded-xl font-medium transition"
  >
    {uploading ? "Uploading..." : "Upload"}
  </button>
</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`backdrop-blur-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-2xl border ${isDark ? 'border-white/10' : 'border-black/10'} overflow-hidden`}>
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  Recent Invoice Activity
                </h3>
                <button className={`px-4 py-2 rounded-xl ${isDark ? 'text-white/70 hover:bg-white/10' : 'text-black/70 hover:bg-black/10'} transition text-sm font-medium cursor-pointer`}>
                  View All →
                </button>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {recentInvoices.map((invoice, index) => (
                <div
                  key={index}
                  className={`p-6 hover:${isDark ? 'bg-white/5' : 'bg-black/5'} transition cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-xl ${isDark ? 'bg-white/10' : 'bg-black/10'} flex items-center justify-center`}>
                        <span className="text-2xl">📄</span>
                      </div>
                      <div>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-black'} text-lg mb-1`}>
                          {invoice.id}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'} flex items-center space-x-3`}>
                          <span>{invoice.client}</span>
                          <span>•</span>
                          <span>{invoice.date}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                            AI: {invoice.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                          {invoice.amount}
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-xl border ${getStatusColor(invoice.status)} font-medium text-sm capitalize`}>
                        {invoice.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}