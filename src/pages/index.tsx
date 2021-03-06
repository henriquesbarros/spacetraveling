import { useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getPrismicClient } from '../services/prismic';

import SEO from '../components/SEO';

// import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination: { next_page, results },
}: HomeProps): JSX.Element {
  const [posts, postsSet] = useState(results);
  const [nextPage, nextPageSet] = useState(next_page);

  async function loadMorePages(): Promise<void> {
    await fetch(next_page)
      .then(response => response.json())
      .then(response => {
        postsSet([...posts, ...response.results]);
        nextPageSet(response.next_page);
      });
  }

  return (
    <>
      <SEO title="Home" />
      <div className={styles.headerHomePage}>
        <figure>
          <img src="Logo.svg" alt="Logo" />
        </figure>
      </div>
      <main className={styles.content}>
        <div>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <h2>{post.data.title}</h2>
                <p>{post.data.subtitle}</p>
                <div className={styles.postInfo}>
                  <div className={styles.first_publication_date}>
                    <FiCalendar />
                    <time>
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM yyyy',
                        { locale: ptBR }
                      )}
                    </time>
                  </div>
                  <div className={styles.author}>
                    <FiUser />
                    <span>{post.data.author}</span>
                  </div>
                </div>
              </a>
            </Link>
          ))}
          {nextPage && (
            <button type="button" onClick={loadMorePages}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

// Pr??-renderiza a p??gina no momento da constru????o(build)
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    { pageSize: 2 }
  );

  const results = postResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: { results, next_page: postResponse.next_page },
    },
  };
};
