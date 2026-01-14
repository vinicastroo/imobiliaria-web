# Auros – Real Estate Internal Management System

Auros is an internal web platform for **real estate agencies**, built with **Next.js** and **React**.  
It centralizes property management, clients, contracts, media uploads, and internal workflows into a single system.

---

## 🚀 Tech Stack

- **Next.js 13**
- **React 18**
- **TypeScript**
- **Prisma**
- **NextAuth**
- **React Query (@tanstack/react-query)**
- **MUI (Material UI)** & **MUI DataGrid**
- **Emotion (CSS-in-JS)**
- **Axios**
- **React Hook Form** + **Zod**
- **FilePond** with multiple plugins
- **Tiptap Rich Text Editor**
- **React Toastify**
- **date-fns**

---

## 🏢 Use Case

This project is built as an **internal management system** for real estate operations:

- Manage **properties**, **clients**, **visits**, and **negotiations**
- Upload and organize **media** (images, documents, contracts)
- Handle **leads** and track their status
- Provide dashboards for agents and admins
- Centralize internal notes and communication
- Automate workflows for real estate activities

---

## 📦 Project Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```

App typically runs at:

```bash
http://localhost:3000
```

### 3. Build for production
```bash
npm run build
```

### 4. Start production server
```bash
npm start
```

### 5. Run linter
```bash
npm run lint
```

---

## 🔧 Environment Variables

Create a `.env.local` file with your configuration.  
Example:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/auros"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

LOGGING_SERVICE_API_KEY="your-logging-api-key"
```

> Adjust to match your infrastructure and Prisma schema.

---

## 📁 Project Structure (simplified)

```bash
.
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/ or pages/         # Application routes
│   ├── components/            # UI building blocks
│   ├── modules/               # Feature modules (properties, clients, etc.)
│   ├── hooks/                 # Custom hooks
│   ├── services/              # API & integrations
│   ├── styles/                # Global and theme styles
│   └── utils/                 # Helpers & utilities
├── public/
├── package.json
└── README.md
```

---

## ✨ Core Features

- 🏠 **Property Management**  
  Register, edit, search, and archive property listings.

- 👥 **Client & Lead Management**  
  Track leads, clients, contacts, and negotiation status.

- 📂 **Media Uploads (FilePond)**  
  Upload photos, documents, and floor plans.

- 📝 **Rich Text Notes (Tiptap)**  
  Internal notes and detailed descriptions.

- 🔐 **Authentication (NextAuth)**  
  Roles, sessions, and protected routes.

- 🔄 **Smart Data Fetching**  
  React Query for caching, invalidation, and performance.

- 📊 **Dashboards for Teams**  
  KPIs, property performance, and agent statistics.

---

## 🧪 Code Quality

- **ESLint** (with Rocketseat config)
- **Prettier** integration
- Enforces clean structure and consistent formatting

---

## 📜 License

Licença MIT - consulte a página [LICENÇA](https://opensource.org/licenses/MIT) para obter detalhes.
