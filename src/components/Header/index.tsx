import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <figure>
          <img src="Logo.svg" alt="Logo" />
        </figure>
      </div>
    </header>
  );
}
