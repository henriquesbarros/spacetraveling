import Link from 'next/link';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Link href="/">
          <a>
            <figure>
              <img src="/Logo.svg" alt="logo" />
            </figure>
          </a>
        </Link>
      </div>
    </header>
  );
}
