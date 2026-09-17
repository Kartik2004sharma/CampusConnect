export default function MeteorLogo({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Meteor Trails */}
      <path d="M21 3L10 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M17 1L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M23 7L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      {/* Meteor Core */}
      <circle cx="8" cy="16" r="5" fill="currentColor"/>
    </svg>
  );
}
