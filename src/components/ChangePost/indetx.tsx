import Link from 'next/link';

import styles from './changePost.module.scss';

export default function ChangePost(): JSX.Element {
  return (
    <>
      <div className={styles.divider} />
      <div className={styles.container}>
        <div className={styles.changePost}>
          <p>Como utilizar Hooks</p>
          <Link href="/">
            <a>Post anterior</a>
          </Link>
        </div>
        <div className={styles.changePost}>
          <p>Criando um app CRA do Zero</p>
          <Link href="/">
            <a className={styles.secondAnchor}>Próximo post</a>
          </Link>
        </div>
      </div>
    </>
  );
}
