import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "#28a745", // Green background
          "--normal-text": "#fff", // White text for contrast
          "--normal-border": "var(--border)"
        }
      }
      {...props} />
  );
}

export { Toaster }
