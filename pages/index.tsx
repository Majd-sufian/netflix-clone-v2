import Head from 'next/head';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { modalState, movieState } from '../atoms/modalAtom.';
import { Header, Banner, Modal, Row, Footer } from '../components/index';
import { Movie } from '../typings';
import requests from '../utils/requests';

interface HomeProps {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
}: HomeProps): JSX.Element => {
  const showModal = useRecoilValue(modalState);
  const movie = useRecoilValue(movieState);
  const rows = useMemo(() => {
    return [
      { title: 'Trending now', movies: trendingNow },
      { title: 'Top Rated', movies: topRated },
      { title: 'Comedies', movies: comedyMovies },
      { title: 'Action movies', movies: actionMovies },
      { title: 'Scary movies', movies: horrorMovies },
      { title: 'Romence movies', movies: romanceMovies },
      { title: 'Documentaries', movies: documentaries },
    ];
  }, []);

  return (
    <div
      className={`relative h-screen bg-gradient-to-b from-gray-900/10 to-[#010511] lg:h-[140vh] ${
        showModal && '!h-screen overflow-hidden'
      }`}
    >
      <Head>
        <title>
          {movie?.title || movie?.original_name || 'Home'} - Netflix
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16 ">
        <Banner netflixOriginals={netflixOriginals} />

        <section className="md:space-y-24">
          {rows.map((row, i) => (
            <Row key={i} title={row.title} movies={row.movies} />
          ))}
        </section>
      </main>

      <Footer />
      {showModal && <Modal />}
    </div>
  );
};

export default Home;

export const getServerSideProps = async (): Promise<{
  props: HomeProps;
}> => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
    },
  };
};
