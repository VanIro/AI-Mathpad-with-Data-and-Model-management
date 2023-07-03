import './vis_placeholder.css'

function VisPlaceholder({ label }) {
  return (
    <div className="vis-placeholder-container">
      <div className="vis-placeholder">
        <h4>Use above filters appropriately to get the {label}</h4>
      </div>
    </div>
  );
}

export default VisPlaceholder;