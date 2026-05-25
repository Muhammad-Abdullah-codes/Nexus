# Business Nexus

Business Nexus is a modern, responsive frontend web application designed to seamlessly connect Startup Founders (Entrepreneurs) with Venture Capitalists (Investors). It provides a secure, role-based dashboard for deal-flow management, communication, and financial tracking.

**🌐 Live Preview:** [https://nexus-nine-jade.vercel.app/](https://nexus-nine-jade.vercel.app/)

---

## 🚀 Features

### Core Architecture & UX

- **Role-Based Dashboards:** Distinct user interfaces and navigation flows tailored specifically for Investors and Entrepreneurs.
- **Interactive Onboarding:** Role-specific guided product walkthroughs powered by `react-joyride`.
- **Adaptive Theming:** Seamless Light/Dark mode toggling with persistent state management.
- **Fully Responsive:** Mobile, tablet, and desktop optimized layouts utilizing Tailwind CSS.

### Security & Authentication

- **Advanced Auth Flow:** Multi-step login process with simulated Two-Factor Authentication (2FA).
- **Password Security:** Real-time password strength meter enforcing strict credential requirements.
- **Demo Access:** Quick-fill demo credentials for seamless stakeholder testing.

### Modules & Workflows

- **Wallet & Payments:** A simulated, Stripe-inspired financial dashboard displaying real-time balances, transaction history, and deal funding flows.
- **Document Chamber:** A secure interface for uploading pitch decks, reviewing contracts, and an e-signature pad mockup for term sheets.
- **Video Communications:** A dedicated WebRTC-inspired video calling interface with screen sharing and hardware toggle mockups.
- **Meeting Scheduler:** Calendar integration preparation for managing availability, pitch meetings, and due diligence calls.

---

## 🛠️ Tech Stack

- **Framework:** React 18 (Bootstrapped with Vite)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Onboarding:** React Joyride
- **State Management:** React Context API (AuthContext, ThemeContext)

---

## 📂 Architecture Overview

For a detailed breakdown of the component structure, routing methodology, and data flow, please refer to the [Architecture Documentation](ARCHITECTURE.md).

---

## 💻 Quick Start

Follow these instructions to run the project locally.

### Prerequisites

- Node.js (v16.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
    git clone [https://github.com/Muhammad-Abdullah-codes/Nexus.git](https://github.com/Muhammad-Abdullah-codes/Nexus.git)
    cd business-nexus

   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Start the development server**
   Open your browser and navigate to http://localhost:5173
