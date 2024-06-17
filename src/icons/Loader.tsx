export default function Loader() {
  return (
    <svg width="40px" height="40px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="none" strokeWidth="6" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" values="500;300;0"></animate>
        <animate
          attributeName="stroke-dasharray"
          dur="2s"
          repeatCount="indefinite"
          values="0 250.5;150 100.5;0 250.5"></animate>
      </circle>
    </svg>
  );
}
