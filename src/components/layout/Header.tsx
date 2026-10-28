import { Wind } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="콧바람 홈">
          <span className={styles.logoMark}><Wind size={28} strokeWidth={2.2} aria-hidden="true" /></span>
          <span className={styles.brandName}>콧바람</span>
        </Link>
        <nav className={styles.nav} aria-label="주요 메뉴">
          <Link to="/">메인</Link>
          <Link to="/festivals/list">축제 탐색</Link>
        </nav>
      </div>
    </header>
  );
}
