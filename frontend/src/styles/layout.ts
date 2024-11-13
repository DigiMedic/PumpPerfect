// Konstanty pro layout a rozložení
export const layout = {
  container: {
    maxWidth: "1400px",
    padding: {
      mobile: "1rem",
      tablet: "2rem",
      desktop: "4rem",
    },
  },
  spacing: {
    section: {
      mobile: "2rem",
      tablet: "4rem",
      desktop: "6rem",
    },
    component: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
    },
    element: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
    },
  },
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  header: {
    height: "4rem",
  },
  footer: {
    height: "auto",
    minHeight: "12rem",
  },
  sidebar: {
    width: "16rem",
  },
  zIndex: {
    modal: 100,
    overlay: 90,
    dropdown: 80,
    header: 70,
    footer: 60,
  },
} 