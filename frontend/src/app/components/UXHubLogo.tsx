import React from "react";

interface UXHubLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "dark" | "light" | "white" | "auto";
  size?: number | string;
}

export default function UXHubLogo({
  variant = "dark",
  size,
  className = "",
  style,
  ...props
}: UXHubLogoProps) {
  const strokeColor =
    variant === "white"
      ? "#ffffff"
      : variant === "light"
      ? "#f8fafc"
      : variant === "auto"
      ? "currentColor"
      : "#1e2022";

  const dotColor = "#f56523";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 250 100"
      fill="none"
      className={className}
      style={{ width: size, height: typeof size === "number" ? size * 0.4 : undefined, ...style }}
      {...props}
    >
      {/* Letter 'U' */}
      <path
        d="M 20 10 V 63 C 20 78 32 90 47 90 C 62 90 74 78 74 63 V 10"
        stroke={strokeColor}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Letter 'X' with 4 radiating diagonal rays */}
      <g stroke={strokeColor} strokeWidth="13" strokeLinecap="round">
        <line x1="103" y1="10" x2="133" y2="40" />
        <line x1="103" y1="90" x2="133" y2="60" />
        <line x1="183" y1="10" x2="153" y2="40" />
        <line x1="183" y1="90" x2="153" y2="60" />
      </g>

      {/* Center Orange Dot */}
      <circle cx="143" cy="50" r="5.5" fill={dotColor} />

      {/* Vertical 'HUB' text rotated -90 degrees */}
      <g transform="rotate(-90 224 50)">
        <text
          x="224"
          y="60"
          fontFamily="'Inter', 'Outfit', 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="31"
          fill={strokeColor}
          letterSpacing="0.22em"
          textAnchor="middle"
        >
          HUB
        </text>
      </g>
    </svg>
  );
}
