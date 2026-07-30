# 🛡️ Security Bundle Builder

A responsive web application for building a custom home security system using Wyze products. Users can configure cameras, sensors, monitoring plans, and additional accessories, then review their complete bundle before checkout.

---

## 🚀 Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- **Git**
- **Node.js** (LTS recommended)
- **npm** (included with Node.js)

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Yousef-Maghrabi/ee_take_home.git
   ```

2. Navigate into the project directory:

   ```bash
   cd ee_take_home
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit:

   ```
   http://localhost:5173
   ```

---

## 🏗️ Architecture & Tech Stack

### Core Technologies

- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**

> **Note:** This project intentionally uses standard React instead of Next.js to align with the requirements of the take-home exercise.

### Project Structure

- **Design Tokens**
  - Centralized styling configuration in `src/theme.ts`.

- **Feature Sections**
  - `Cameras.tsx`
  - `Plans.tsx`
  - `Sensors.tsx`
  - `Extras.tsx`
  - `Review.tsx`

- **Reusable Components**
  - Shared UI components are centralized in `src/components/index.tsx` to encourage consistency and reduce duplication.

---

## ✨ Enhancements

### Responsive Design

- Optimized product grid layouts for mobile, tablet, and desktop.
- Improved spacing and wrapping behavior across different screen sizes.

### User Experience

- Enhanced visual hierarchy using brand accent colors.
- Improved accordion interactions with active-state backgrounds and adaptive spacing.
- Consistent component spacing and typography throughout the application.

### Code Organization

- Centralized design tokens for easier maintenance.
- Modular feature-based architecture.
- Reusable UI components to minimize repetition.

---

## 🔮 Future Improvements

Given additional time, the following improvements would be prioritized:

- **Component Abstraction**
  - Consolidate the nearly identical section components (`Cameras`, `Sensors`, `Plans`, etc.) into a single configurable, data-driven section component.

- **State Management**
  - Introduce a dedicated state management solution (such as Context or Zustand) if the application grows in complexity.

- **Testing**
  - Add unit and integration tests using Vitest and React Testing Library.

- **Performance**
  - Memoize expensive renders where appropriate.
  - Lazy-load larger sections if the catalog expands.

- **Accessibility**
  - Continue improving keyboard navigation and screen reader support to ensure a fully accessible experience.

---

## 📁 Repository

```
git clone https://github.com/Yousef-Maghrabi/ee_take_home.git
```

---

Built as a take-home exercise with a focus on clean architecture, reusable components, responsive design, and maintainable code.