import { useState } from 'react';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';

// import commonStyles from '../styles/common.module.scss';
// import styles from './home.module.scss';

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
  const [posts, postsSet] = useState<Post[]>(results);
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
    <ul>
      {posts.map(post => (
        <li key={post.uid}>
          <h2>{post.data.title}</h2>
          <p>{post.data.subtitle}</p>
          <span>{post.first_publication_date}</span>
          <span>{post.data.author}</span>
        </li>
      ))}
      {nextPage && (
        <button type="button" onClick={loadMorePages}>
          Carregar mais posts
        </button>
      )}
    </ul>
  );
}

// Pré-renderiza a página no momento da construção(build)
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
