# 🎬 CinePass - Movie Ticket & Snacks Booking Platform

**CinePass** is a modern, responsive single-page web application (SPA) built for seamless movie ticket bookings and cinema snacks pre-ordering. It features real-time seat selection, a dynamic concession stand, instant receipt generation with QR codes, and integrated authentication.

---

## 🌟 Key Features

* **🍿 Cinema Snacks Management**:
  * Browse movie munchies with dynamic category filtering (*Popcorn, Beverages, Combos*).
  * Interactive cart with instant price & 18% GST calculation.
  * Standalone snacks booking or integrated movie ticket checkout.
  * Clear **"Snacks: None"** status indicator on tickets if skipped.

* **🎟️ Ticket & Seat Reservation**:
  * Real-time seat layout for movie selection.
  * Instant ticket receipt generation with mock QR Code scanning.
  * Dedicated **My Tickets / Dashboard** view with print & cancel options.

* **🔐 User Authentication & Authorization**:
  * User-specific ticket filtering (*shows only logged-in user's bookings*).
  * Persistent sessions with Pinia state management & `localStorage`.

* **🎨 Modern UI/UX**:
  * Glassmorphism dark-theme aesthetics.
  * Fully responsive grid powered by **Vuetify 3**.

---

## 🛠️ Tech Stack

* **Frontend Framework:** Vue 3 (Composition API `<script setup>`)
* **UI Component Library:** Vuetify 3 / Material Design Icons (`@mdi/font`)
* **State Management:** Pinia
* **Routing:** Vue Router 4
* **Backend Mocking:** JSON Server (`db.json`)
* **Build Tool:** Vite

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites
Make sure you have **Node.js** (v16+ recommended) and **npm** installed on your system.

### 2. Project Installation
Clone the repository and install dependencies:

```bash
# Clone repository
git clone [https://github.com/your-username/cinepass.git](https://github.com/your-username/cinepass.git)

# Navigate into project folder
cd cinepass

# Install dependencies
npm install
