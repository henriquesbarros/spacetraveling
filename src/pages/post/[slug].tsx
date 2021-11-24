/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import ChangePost from '../../components/ChangePost/indetx';
import Comments from '../../components/Comments';

import { calculateReadingTime } from '../../utils/reading-time';

import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';
import SEO from '../../components/SEO';

// import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const { isFallback } = useRouter();

  if (isFallback) return <p>Carregando...</p>;

  const readingTime = calculateReadingTime(post);

  return (
    <>
      <SEO title={post.data.title} />
      <Header />
      <main>
        <figure className={styles.banner}>
          <img src={post.data.banner.url} alt="Banner" />
        </figure>
        <article className={styles.content}>
          <h1>{post.data.title}</h1>
          <div className={styles.postInfo}>
            <div className={styles.first_publication_date}>
              <FiCalendar />
              <time>
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
            </div>
            <div className={styles.author}>
              <FiUser />
              <span>{post.data.author}</span>
            </div>
            <div className={styles.readingTime}>
              <FiClock />
              <span>{readingTime} min</span>
            </div>
          </div>
          <div className={styles.text}>
            {post.data.content.map(postData => (
              <div key={postData.heading}>
                <h2>{postData.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(postData.body),
                  }}
                />
              </div>
            ))}
          </div>
        </article>
      </main>
      <footer className={styles.footer}>
        <ChangePost />
        <Comments />
      </footer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const { results } = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title'],
    }
  );

  const paths = [];

  results.forEach((post, index) => {
    if (index < 20) paths.push({ params: { slug: post.uid } });
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      banner: {
        url: response.data.banner?.url ?? '',
      },
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
  };
};
