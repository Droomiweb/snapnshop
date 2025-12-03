export default function Logo({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Shopping Bag Handle */}
      <path 
        d="M11 10V7C11 4.23858 13.2386 2 16 2C18.7614 2 21 4.23858 21 7V10" 
        stroke={color} 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* Bag Body */}
      <path 
        d="M6 10H26L24.5 29H7.5L6 10Z" 
        stroke={color} 
        strokeWidth="2.5" 
        strokeLinejoin="round"
      />
      
      {/* "Snap" Lens / Aperture in the center */}
      <circle cx="16" cy="19" r="5" stroke={color} strokeWidth="2" />
      <circle cx="16" cy="19" r="2" fill={color} />
      
      {/* Flash Accent */}
      <path d="M23 4L26 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M25 7L28 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}