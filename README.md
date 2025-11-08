<div align="center">

# 🚀 ERPMAX

### Complete Business Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)

A comprehensive ERP and accounting software built with React, TypeScript, and modern web technologies. ERPMAX provides a complete solution for managing sales, purchases, inventory, accounting, and financial reporting.

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## ✨ Features

### 📊 **Dashboard**
- Real-time business metrics and KPIs
- Interactive charts and graphs
- Recent transactions overview
- Quick action buttons

### 💰 **Sales Management**
- **Invoices**: Create, edit, and manage sales invoices
- **Customers**: Complete customer database with contact management
- **Sales Returns**: Handle product returns efficiently
- **Payments**: Track customer payments and outstanding balances

### 🛒 **Purchase Management**
- **Bills**: Manage vendor bills and purchase orders
- **Vendors**: Vendor database with multiple contact persons
- **Purchase Returns**: Process vendor returns
- **Payments**: Track vendor payments and dues

### 📦 **Inventory Management**
- **Items**: Manage products and services
- **Item Groups**: Bulk item creation and management
- **Inventory Adjustments**: Quantity and value adjustments
- **Stock Tracking**: Real-time inventory levels
- **Barcode Support**: UPC, EAN, ISBN, MPN

### 📚 **Accounting**
- **Chart of Accounts**: Hierarchical account structure
- **Journal Vouchers**: Multi-entry accounting vouchers
- **Double-Entry Bookkeeping**: Automatic debit/credit balancing
- **Account Types**: Asset, Liability, Equity, Revenue, Expense

### 🏦 **Cash & Bank**
- **Cash Payments & Receipts**: Petty cash management
- **Bank Payments & Receipts**: Bank transaction tracking
- **Multi-Account Support**: Multiple cash and bank accounts

### 📈 **Reports** (11+ Reports)
- **Financial Statements**
  - Profit & Loss Statement
  - Balance Sheet
  - Cash Flow Statement
- **General Ledger**
  - Trial Balance
  - General Ledger Summary
  - Detailed General Ledger
- **Sales & Receivables**
  - Sales by Customer
  - Sales by Item
  - A/R & A/P Summary
- **Purchases & Payables**
  - Sales & Purchases by Partner
- **Inventory**
  - Inventory Ledger
- **Interactive Drill-Down**: Click through from reports to ledgers to source documents

### ⚙️ **Settings**
- Organization profile and branding
- User roles and permissions
- Transaction number series
- Email notifications
- Opening balances

### 🎨 **UI/UX Features**
- Modern, clean interface
- Dark mode support
- Fully responsive design
- Toast notifications
- Error boundary for crash protection
- System fonts for fast loading

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **TypeScript** | 5.8.2 | Type Safety |
| **Vite** | 6.2.0 | Build Tool |
| **React Router** | 7.9.4 | Navigation |
| **Recharts** | 3.3.0 | Data Visualization |
| **Lucide React** | 0.548.0 | Icons |
| **Tailwind CSS** | CDN | Styling |
| **React Hot Toast** | Latest | Notifications |

---

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/erpmax.git

# Navigate to project directory
cd erpmax

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:8000
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 📂 Project Structure

```text
erpmax/
├── components/          # Reusable UI components
│   ├── accounts/       # Accounting components
│   ├── customers/      # Customer management
│   ├── dashboard/      # Dashboard widgets
│   ├── inventory/      # Inventory components
│   ├── layout/         # Layout components
│   ├── payments/       # Payment components
│   ├── purchases/      # Purchase components
│   ├── reports/        # Report components
│   ├── sales/          # Sales components
│   ├── settings/       # Settings components
│   ├── ui/             # Reusable UI elements
│   ├── vendors/        # Vendor management
│   ├── vouchers/       # Voucher components
│   └── ErrorBoundary.tsx
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Sales.tsx
│   ├── Purchases.tsx
│   ├── Inventory.tsx
│   ├── Accounts.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── utils/              # Utility functions
│   └── toast.ts        # Toast notifications
├── types.ts            # TypeScript definitions
├── constants.ts        # App constants
├── App.tsx             # Main app component
├── index.tsx           # Entry point
├── index.html          # HTML template
├── index.css           # Global styles
└── vite.config.ts      # Vite configuration
```

---

## 🎯 Key Features Explained

### Error Boundary
Catches React errors and displays a friendly error page instead of crashing the app.

### Toast Notifications
Professional notifications for user actions:
- Success messages (green)
- Error messages (red)
- Info messages (blue)
- Warning messages (orange)

### Dark Mode
Full dark mode support across all pages and components.

### Responsive Design
Works seamlessly on desktop, tablet, and mobile devices.

### Type Safety
Full TypeScript implementation for better code quality and developer experience.

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=ERPMAX+Dashboard)

### Sales Invoice
![Invoice](https://via.placeholder.com/800x400?text=Sales+Invoice)

### Reports
![Reports](https://via.placeholder.com/800x400?text=Financial+Reports)

### Dark Mode
![Dark Mode](https://via.placeholder.com/800x400?text=Dark+Mode)

---

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Complete frontend implementation
- ✅ All core modules functional
- ✅ Toast notifications
- ✅ Error boundary
- ✅ Dark mode

### Phase 2 (Upcoming)
- [ ] Backend API (Node.js/Express)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication & authorization
- [ ] Data persistence
- [ ] API documentation

### Phase 3 (Future)
- [ ] PDF generation
- [ ] Excel export
- [ ] Email integration
- [ ] Multi-currency support
- [ ] Tax calculations (GST/VAT)
- [ ] Payment gateway integration
- [ ] Mobile app
- [ ] Multi-company support

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- 📧 Email: <support@erpmax.com>
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/erpmax/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/yourusername/erpmax/discussions)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- All contributors who help improve ERPMAX

---

<div align="center">

### ⭐ Star us on GitHub — it motivates us a lot!

Made with ❤️ by **ERPMAX Team**

[Website](https://erpmax.com) • [Documentation](https://docs.erpmax.com) • [Blog](https://blog.erpmax.com)

</div>
