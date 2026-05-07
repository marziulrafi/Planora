# Planora - Event Management Platform

Planora is a modern full-stack event management platform where users can create, manage, discover, and join events through a clean and responsive interface.

The frontend is built with Next.js and Tailwind CSS, providing a fast, scalable, and responsive user experience with authentication, dashboards, event workflows, and payment integration.

## Live Links
🔗 [Frontend](http://planora-smoky.vercel.app/)

🔗 [Backend API](https://planora-server-mozw.onrender.com/)

🔗 [Server Repository](https://github.com/marziulrafi/Planora-Server)

## Features

- Secure Authentication System
- Protected Dashboard Routes
- Public & Private Event Browsing
- Event Search & Filtering
- Event Creation & Management
- Invitation System
- Participant Approval Workflow
- Stripe Payment Integration
- Reviews & Ratings
- Admin Dashboard
- Responsive Design for Mobile, Tablet & Desktop
- Toast Notifications & Loading States

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- React Hot Toast
- Framer Motion

## Setup Instructions

### Clone Repository

```bash
git clone https://github.com/marziulrafi/Planora
```

### Navigate to Project

```bash
cd planora
```

### Install Dependencies

```bash
pnpm install
```

### Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=YOUR_BACKEND_URL/api
```

### Run Development Server

```bash
pnpm dev
```

Frontend will run on:

```bash
http://localhost:3000
```

### Build for Production

```bash
pnpm build
pnpm start
```
