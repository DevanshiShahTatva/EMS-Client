# 🎉 Event Management App (Frontend)

A modern event management frontend built using **Next.js**, **React.js**, and **Tailwind CSS**. This responsive web interface enables users to effortlessly browse, create, edit, and manage events. It also allows users to book tickets and discover exciting events happening nearby. Built for seamless interaction with the backend via REST APIs, the app ensures a smooth and intuitive experience across all devices.

---

## ✨ Features

- User-friendly UI with responsive design
- Event creation and editing forms
- Event listing with filters and pagination
- Ticket booking flow with real-time availability check
- Booking confirmation and summary page
- Authentication-integrated views
- Status indicators (Upcoming, Ongoing, Ended, Sold Out)

---

## 🧰 Tech Stack

- **Framework:** Next.js 15  
- **UI Library:** React.js
- **Styling:** Tailwind CSS, ShadCN Library & Hero Icons 
- **State Management:** React State  
- **API Communication:** Fetch / Axios  
- **Deployment:** Netlify

---

## 🛠 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://gitlab.anasource.com/event-management-group/event-management-client.git
cd event-management-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run in Development Mode

```bash
npm run dev
```

### 4. Build the App for Production

```bash
npm run build
```

### 5. Start the Production Server

```bash
npm start
```

---

---

## 🧾 Folder Structure

```
├── components
│   ├── EventCard
│   ├── EventForm
│   └── AddressAutocomplete
├── pages
│   ├── index.tsx
│   ├── create.tsx
│   └── edit/[id].tsx
├── public
├── styles
│   └── globals.css
├── utils
│   └── helpers.ts
├── .env.local
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---