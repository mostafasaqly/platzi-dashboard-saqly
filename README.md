# Platzi Admin Dashboard — Phase 1

**Foundation • System Design • App Skeleton**

Production-grade Admin Dashboard built with **Angular 21**, **PrimeNG 21**, and **SCSS architecture**, powered by the **Platzi Fake Store API**.

This repository focuses on building a **clean, scalable, enterprise-level frontend architecture from day one**.

---

# Tech Stack

* **Angular 21**
* **Standalone Architecture**
* **Signals**
* **PrimeNG 21**
* **SCSS Design System**
* **TypeScript Strict Mode**
* **Route-Level Lazy Loading**
* **REST API Integration**
* **Enterprise Project Structure**

API Source:
https://api.escuelajs.co/docs

---

# Project Goals

This project is designed to demonstrate **real-world Angular architecture** rather than a simple CRUD dashboard.

Goals include:

* scalable frontend architecture
* production-ready code quality
* modern Angular features
* enterprise folder boundaries
* strong typing
* clean UI system
* maintainable design system

---

# System Architecture

The project follows a **Clean Frontend Architecture** approach.

```
src/app
│
├── core
│   ├── config
│   ├── guards
│   ├── interceptors
│   ├── layout
│   ├── services
│   └── constants
│
├── shared
│   ├── components
│   ├── directives
│   ├── pipes
│   ├── models
│   └── ui
│
├── features
│   ├── auth
│   ├── dashboard
│   ├── products
│   ├── categories
│   ├── users
│   ├── file-upload
│   └── settings
│
└── app.config.ts
```

### Core Layer

Contains **global application logic**

Examples:

* guards
* interceptors
* layout shell
* app constants
* global services

### Shared Layer

Reusable building blocks:

* UI components
* directives
* pipes
* shared models
* PrimeNG wrappers

### Features Layer

Domain modules of the dashboard:

* auth
* dashboard
* products
* categories
* users
* file upload
* settings

Each feature is **lazy loaded**.

---

# Routing Strategy

The app uses **route-level lazy loading** with guards.

Example:

```
/auth
/dashboard
/products
/categories
/users
/files
/settings
```

Structure:

```
Auth Area (Guest Only)
│
└── /auth

Protected Area (AppShell)
│
├── /dashboard
├── /products
├── /categories
├── /users
├── /files
└── /settings
```

Guards used:

* `authGuard`
* `guestGuard`

---

# Application Shell

The **AppShell** provides the main layout.

```
AppShell
│
├── Sidebar
├── Topbar
└── Router Outlet
```

Responsibilities:

* layout structure
* navigation
* responsive behavior
* global loading indicators

---

# State Strategy

Angular **Signals** are used for local state management.

Benefits:

* simpler than RxJS stores
* reactive UI
* minimal boilerplate

---

# Styling Architecture

The project uses a **SCSS design system** with tokens.

Structure:

```
styles
│
├── tokens
│   ├── colors
│   ├── spacing
│   ├── typography
│   └── radius
│
├── base
├── utilities
└── themes
```

Design tokens ensure:

* visual consistency
* easy theme changes
* scalable UI system

---

# PrimeNG Integration

PrimeNG is integrated globally via:

```
providePrimeNG()
```

Theme system:

```
@primeuix/themes/lara
```

Used components:

* DataTable
* Dialog
* Toast
* Button
* InputText
* Select
* FileUpload
* ConfirmDialog

---

# Environment Strategy

Environment files:

```
environment.ts
environment.development.ts
environment.production.ts
```

Typed configuration is used to avoid runtime errors.

Example:

```ts
export const environment = {
  apiUrl: 'https://api.escuelajs.co/api/v1'
};
```

---

# HTTP Architecture

Global HTTP setup includes:

* API interceptor
* error handling
* loading indicators
* authentication token injection

Example flow:

```
Component
   ↓
Service
   ↓
HttpClient
   ↓
API Interceptor
   ↓
Backend
```

---

# Global UX Conventions

The project includes global UX standards:

### Loading states

* page loading
* table loading
* button loading

### Error states

* toast notifications
* API error messages

### Empty states

* no data indicators
* fallback UI

---

# Development Setup

Clone the repository:

```bash
git clone https://github.com/mostafasaqly/platzi-dashboard-saqly.git
```

Install dependencies:

```bash
npm install
```

Run the project:

```bash
ng serve
```

Open:

```
http://localhost:4200
```

---

# Phase Roadmap

### Phase 1 Foundation & Architecture --- Finished

Foundation & Architecture

* system design
* routing skeleton
* app shell
* design tokens
* PrimeNG integration

---

### Phase 2 — Core Infrastructure --- Finished

Authentication System

* login page
* token handling
* auth guards
* interceptor

---

### Phase 3 --- Finished

Auth Module

* Login
* service
* interceptor

---

### Phase 4 --- Finished

Dashboard Module

* analytics widgets
* charts
* summary cards

---

### Phase 4

Products Management

* product table
* CRUD operations
* filters
* pagination

---

### Phase 5

Users & Categories

* user management
* category management

---

### Phase 6

File Upload System

* image uploads
* preview
* storage handling

---

### Phase 7

Settings Module

* profile
* preferences
* application configuration

---

# Architecture Principles

This project follows strict engineering rules:

* no temporary solutions
* strong typing everywhere
* scalable folder boundaries
* reusable UI
* clear separation of concerns
* performance-first design

---

# Author

**Mostafa Saqly**
Frontend Engineer

LinkedIn:
https://www.linkedin.com/in/mostafa-saqly/
