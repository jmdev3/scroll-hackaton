import styles from "./PredictionButton.module.css";

interface PredictionButtonProps {
  variant: "yes" | "no" | "winning";
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function PredictionButton({
  variant,
  onClick,
  disabled = false,
  children,
  className = "",
  ...props
}: PredictionButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
