import { Provider } from "next-auth/client";
import Head from "next/head";

import "antd/dist/antd.min.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import "../styles/main.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
      </Head>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
