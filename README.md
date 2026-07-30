# Security Bundle Builder
Build a custom home security system using Wyze equipment.

## How to setup
1. make sure you have git installed if not please do
2. make sure you have node.js and npm installed if not please do
3. clone the project by running this in your terminal 'git clone https://github.com/Yousef-Maghrabi/ee_take_home.git'
4. navigate to the project directory by running this in your terminal 'cd ee_take_home' 
5. install deps by running the following in your terminal 'npm install' 
6. run the application 'npm run dev' 
7. visit the app at 'http://localhost:5173'


## Architecture & Tech Stack
- **Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React *(Note: Built with standard React rather than Next.js to match the specific constraints of the exercise).*
- **Styling:** Tailwind CSS combined with a centralized design token configuration (`src/theme.ts`).
- **Modular Sections:** Broken down into `Cameras.tsx`, `Plans.tsx`, `Sensors.tsx`, `Extras.tsx`, and `Review.tsx`.
- **Reusable Components:** Core UI components centralized in `src/components/index.tsx`.

## Key Enhancements & Extras
- **Responsive Layout Optimization:** Custom responsive grid handling for product cards on tablet and desktop breakpoints to ensure clean spacing and zero awkward wrapping.
- **Visual Polish:** Integrated brand accent colors into headers for stronger visual hierarchy.
- **Accessibility & UX:** Added dynamic padding and distinct background states when an accordion section is active.

## Known Limitations / Future Improvements
- **Component Refactoring:** The section components (`Cameras.tsx`, `Sensors.tsx`, etc.) share a largely identical structure. Given more time, these would be abstracted into a single reusable dynamic section builder component.