import { Link } from "react-router-dom";

export function ShellFooter() {
  return (
    <footer className="shell-footer">
      <nav aria-label="Legal">
        <ul className="shell-footer-list">
          <li><Link className="nav-link" to="/contact">Contact</Link></li>
          <li><Link className="nav-link" to="/privacy">Privacy</Link></li>
          <li><Link className="nav-link" to="/terms">Terms</Link></li>
        </ul>
      </nav>
    </footer>
  );
}
