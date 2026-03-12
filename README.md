# 💼 SpendDock — AI-Powered Invoice Management System

> Final Year Project | B2B Invoice Processing Platform

SpendDock is a B2B invoice management platform designed to reduce the manual workload of accountants and finance teams. It streamlines the entire invoice lifecycle — from vendor submission to client approval and payment tracking — using AI-powered data extraction.

---

## 🚀 What SpendDock Does

In traditional businesses, accountants manually process hundreds of invoices — extracting data, verifying details, chasing approvals, and tracking payments. SpendDock automates this entire workflow:

- 📤 **Vendors** upload invoices (PDF) through their portal
- 🤖 **AI** automatically extracts invoice data (vendor name, amount, date, items)
- 👔 **Clients (Company B)** review, approve or reject invoices
- 💳 **Payments** are tracked and marked as paid
- 📊 **Managers** get a full overview of all invoice activity
- 📧 **Email invites** allow companies to onboard vendors seamlessly

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Vendor** | Upload invoices, track status |
| **Client** | Review, approve/reject, mark paid |
| **Manager** | Full dashboard, invite vendors, analytics |

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React + Vite
- 🎨 Tailwind CSS
- 🔐 Supabase Auth (email/password login)

### Backend
- ☕ Java Spring Boot
- 🗄️ PostgreSQL (via Supabase)
- 📧 Supabase email invite system
- 🤖 AI invoice extraction (REST API)

---

## 📁 Project Structure

This repo has **2 branches:**

| Branch | Contents |
|--------|----------|
| `main` | Backend — Java Spring Boot |
| `frontend` | Frontend — React + Vite |

---

## ⚙️ How to Run

### 1. Clone the repo
```bash
git clone https://github.com/Vivek4380/SpendDock-hardcoded.git
cd SpendDock-hardcoded
```

### 2. Run Backend (main branch)
```bash
# Already on main branch
# Add your application.properties in:
# src/main/resources/application.properties

./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### 3. Run Frontend (frontend branch)
```bash
git checkout frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔐 Environment Setup

### Backend — `src/main/resources/application.properties`
```properties
spring.datasource.url=YOUR_SUPABASE_DB_URL
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
supabase.url=YOUR_SUPABASE_URL
supabase.service.key=YOUR_SERVICE_ROLE_KEY
server.port=8080
app.frontend.url=http://localhost:5173
```

### Frontend — `.env`
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

---

## 📌 Version Note
> ⚠️ This is the **hardcoded stable build — before AI integration.**
> 
> - Invoice data is manually structured (no real AI extraction yet)
> - This version was built to validate the full workflow end-to-end
> - The next version will include real AI-powered PDF extraction and processing
> - AI-integrated version will be available in a separate repository

---

*Final Year Project — 2026*
