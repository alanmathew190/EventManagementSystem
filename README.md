🌐 EventSphere

EventSphere is an open-source event management platform focused on simplicity, accessibility, and modern UI patterns.
It provides a clean foundation for building event-driven applications with customizable theming and reusable components.

✨ Features

🔐 Authentication System

User login & registration

Client-side form validation

Password visibility toggles

Clear and accessible error handling

🧊 Modern Glass UI

Glassmorphism-styled auth forms

Theme-agnostic design using CSS variables

Works on light and dark backgrounds

🎨 Customizable Theming

No hard-coded brand colors

Easy theme overrides via CSS variables

Maintainer-friendly styling approach

♿ Accessibility First

Proper labels and form semantics

Keyboard-friendly inputs

Improved color contrast for readability

🧩 Extensible Architecture

React Context API for shared state

Clean, reusable component structure

Open-source contribution ready

🖥️ Tech Stack

Frontend: React + TypeScript

Styling: Tailwind CSS

Icons: Lucide React

State Management: React Context API


📂 Project Structure
src/
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── DataContext.tsx
├── styles/
│   └── globals.css
└── App.tsx


⚙️ Installation & Setup
git clone https://github.com/your-username/eventsphere.git
cd eventsphere
npm install
npm run dev


🎨 Theming & Glass UI

EventSphere uses CSS variables for easy customization.

Default Theme
:root {
  --primary: #16a34a;
  --primary-hover: #15803d;

  --glass-bg: rgba(255, 255, 255, 0.75);
  --glass-border: rgba(255, 255, 255, 0.35);
}

Dark Mode Example
.dark {
  --glass-bg: rgba(24, 24, 27, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
}

Glass styling is optional and degrades gracefully if not supported.


🧪 Accessibility Notes

Semantic HTML form structure

Visible focus states

Contrast-safe text and inputs

Screen reader friendly labels

📃⌛Timeline

 Event creation & management

 Event discovery and search

 Organizer & attendee roles

 Reusable UI component library


🙌 Acknowledgements

Icons provided by Lucide

Inspired by modern open-source UI practices

⭐ Support

If you find this project useful, please consider giving it a ⭐
It helps improve visibility and encourages open-source contributions.
