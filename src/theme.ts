/**
 * an object of frequently used styles and design tokens
 */
const st = {
  // Brand Colors
  colors: {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    primaryText: "text-purple-600",
    accent: "bg-purple-50 text-purple-700 border-purple-200",
    borderActive: "border-purple-600 ring-2 ring-purple-600/10",
    borderDefault: "border-slate-200 hover:border-slate-300",
    bg: {
      base: "bg-slate-50",
      elevation: "bg-white",
      subtle: "bg-slate-100",
    },
    text: {
      heading: "text-slate-900",
      body: "text-slate-600",
      muted: "text-slate-400",
    }
  },

  // Typography Styling
  typography: {
    headingSerif: "font-serif text-slate-900 tracking-tight",
    stepHeadline: "font-sans text-xs font-bold tracking-wider text-slate-500 uppercase",
    productTitle: "font-sans text-base font-semibold text-slate-900",
    bodyText: "font-sans text-sm text-slate-600 leading-relaxed",
    priceActive: "font-sans text-sm font-bold text-slate-900",
    priceCompare: "font-sans text-xs text-slate-400 line-through",
  },

  // Components Styling
  components: {
    layoutContainer: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
    card: "rounded-xl border bg-white p-5 transition-all duration-200 shadow-sm",
    cardSelected: "border-purple-600 ring-2 ring-purple-600/10 bg-white",
    cardUnselected: "border-slate-200 hover:border-slate-300 bg-white",
    stepperBtn: "w-8 h-8 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium",
    colorChip: "w-7 h-7 rounded-full border-2 transition-transform active:scale-95 flex items-center justify-center cursor-pointer",
    badgeDiscount: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800",
    btnPrimary: "w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm text-center cursor-pointer",
    btnSecondary: "inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer",
  }
};

export default st;