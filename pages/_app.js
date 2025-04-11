import "../styles/globals.css";
import Head from "next/head";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>News Nexus</title>
        <link rel="icon" href="/favicon_io/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
