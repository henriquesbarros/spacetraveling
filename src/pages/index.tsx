import { useState } from 'react';
import { GetStaticProps } from 'next';
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

  // async function loadMorePages(): Promise<void> {
  //   postsSet([...posts, ...next_page]);
  //   nextPageSet(next_page);
  // }

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
        <ul>
          {posts.map(post => (
            <li key={post.uid}>
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
            </li>
          ))}
          {nextPage && (
            <button type="button" onClick={loadMorePages}>
              Carregar mais posts
            </button>
          )}
        </ul>
      </main>
    </>
  );
}

// Pré-renderiza a página no momento da construção(build)
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    { pageSize: 2 }
  );

  // const nextPageResponse = await fetch(postResponse.next_page)
  //   .then(response => response.json())
  //   .then(response => response.results);

  // const next_page = nextPageResponse.map(nextPage => {
  //   return {
  //     uid: nextPage.uid,
  //     first_publication_date: format(
  //       new Date(nextPage.first_publication_date),
  //       'dd MMM yyyy',
  //       { locale: ptBR }
  //     ),
  //     data: {
  //       title: nextPage.data.title,
  //       subtitle: nextPage.data.subtitle,
  //       author: nextPage.data.author,
  //     },
  //   };
  // });

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
