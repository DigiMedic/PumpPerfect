export function useSound() {
  const playAlert = (type: "high" | "low" | "warning" = "warning") => {
    const audio = new Audio();
    
    switch (type) {
      case "high":
        audio.src = "/sounds/high-alert.mp3";
        break;
      case "low":
        audio.src = "/sounds/low-alert.mp3";
        break;
      default:
        audio.src = "/sounds/warning.mp3";
    }

    audio.play().catch((error) => {
      console.error("Nepodařilo se přehrát zvuk:", error);
    });
  };

  return { playAlert };
} 