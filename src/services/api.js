const BASE_URL = "http://localhost:8080";

/* =========================
   Vendor APIs
========================= */

export async function uploadInvoice(formData) {
  const response = await fetch(`${BASE_URL}/vendor/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Failed to upload invoice");
  }

  return response.json();
}

export async function fetchVendorInvoices(companyId) {
  const response = await fetch(
    `${BASE_URL}/vendor/invoices?companyId=${companyId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch vendor invoices");
  }

  return response.json();
}


/* =========================
   Client APIs
========================= */

export async function fetchClientInvoices() {
  const response = await fetch(`${BASE_URL}/client/invoices`);

  if (!response.ok) {
    throw new Error("Failed to fetch client invoices");
  }

  return response.json();
}

export async function reviewInvoice(invoiceId, status, comment) {
  const response = await fetch(`${BASE_URL}/client/review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      invoiceId,
      status,
      comment
    })
  });

  if (!response.ok) {
    throw new Error("Failed to review invoice");
  }

  return response.json();
}

export async function markInvoicePaid(invoiceId) {
  const response = await fetch(`${BASE_URL}/client/payment`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      invoiceId,
      paymentStatus: "PAID"
    })
  });

  if (!response.ok) {
    throw new Error("Failed to update payment status");
  }

  return response.json();
}

export async function fetchVendorStats(companyId) {
  const response = await fetch(
    `${BASE_URL}/vendor/stats?companyId=${companyId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch vendor stats");
  }

  return response.json();
}