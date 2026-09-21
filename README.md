# OpsDesk IT — Mission-Critical Helpdesk & Service Desk

A modern, high-density, human-friendly IT Helpdesk & Incident Response web application. Built with a clean, minimal design system that rejects "AI slop" (no bubbly rounded-full pill tags, no heavy floating cards with neon drop shadows, and no squinty micro-fonts).

Designed and administered by **John Lester Fuertes**.

---

## Features

- **Clean & Minimal Interface**: Muted monochrome color palette with high contrast in both Dark (Obsidian) and Light modes.
- **Readable Typography**: Large, clear font sizing (16px–20px headings, 14px–16px body/inputs) with generous line heights and spacious click targets.
- **Account & Role-Based Access**:
  - **IT Staff (`agent`)**: Full triage capabilities, SLA oversight, assignment, resolution, and encrypted internal notes.
  - **Regular User (`user`)**: Simplified interface for submitting tickets, tracking personal requests under "My Requests", and replying to support staff.
  - **Privacy Guard**: Internal IT notes are completely hidden from regular employees.
- **Triage Queues**:
  - **Inbox**: All active unresolved incidents.
  - **Assigned to Me / My Requests**: Dynamic filtering based on active user role.
  - **Urgent**: High-priority P1 outages.
  - **Resolved**: Comprehensive resolution history and notes.
- **Command Palette (`⌘ K` / `Ctrl + K`)**: Global instant search, queue navigation, and theme toggling without touching the mouse.
- **Batch Actions**: Multi-select tickets for bulk assignment and resolution.
- **Dual-Theme Support**: Flawless light and dark modes powered by semantic CSS custom properties.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with semantic CSS tokens and custom dark-mode variant
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ or higher
- npm 9+ or higher

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd Ticketing
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   Outputs the optimized production bundle to the `dist/` folder.

---

## Hosting on Vercel

The application is fully prepared for instant deployment to Vercel:

### Method 1: Via Vercel Dashboard (Recommended)
1. Push this project to your GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your app will be live within seconds with zero configuration.

### Method 2: Via Vercel CLI
```bash
npx vercel
```

---

## Cloud Database & User Registration Roadmap

Currently, all user accounts, sessions, and tickets persist locally in browser `localStorage` (`opsdesk_production_tickets_v4`), allowing zero-cost and instant deployment.

To enable multi-device collaboration where employees across your company can register, submit tickets from their own machines, and have them sync in real-time to your dashboard:

### Recommended Backend Architecture
1. **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL) or [Neon](https://neon.tech/) + [Clerk](https://clerk.com/).
   - Free-tier serverless PostgreSQL.
   - Built-in authentication (Email/Password, Google OAuth, Magic Links).
   - Real-time WebSockets so tickets pop up instantly on your screen without refreshing.
2. **Organization Multi-Tenancy**:
   - **Owner / Admin**: John Lester Fuertes (`john.fuertes@company.com`).
   - Domain auto-join: Anyone registering with your organization's domain (e.g. `@yourcompany.com`) is automatically added to your organization workspace as a User.
   - IT technicians can be assigned the `agent` role from your admin dashboard.

---

## License
MIT License. Built for enterprise IT operations.
