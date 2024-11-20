// import { makeFullS3ObjectUrl } from "assets/images";
import React from "react";
import { Helmet } from "react-helmet-async";
// const explorerThumbnailImage = makeFullS3ObjectUrl("explorer-thumb.jpg");
// interface ISEOMetaPropsType {
//     title?: string;
//     thumbnail?: string;
//     description?: string;
//     type?: string;
//     url?: string;
//     script?: string;
// }
const GlobalHelmetProvider = ({ title, thumbnail, description, type, url, script }) => {
  return (
    <Helmet>
      {title && <title>edeXa NFT - {title || ""}</title>}

      {description && <meta name="description" content={description || ""} />}

      {/* meta tags for opengraph */}
      {title && <meta property="og:title" content={`edeXa NFT - ${title}`} />}
      <meta property="og:type" content={"website"} />
      <meta property="og:url" content={window.location.href} />
      {/* <meta property="og:image" content={thumbnail || explorerThumbnailImage} /> */}

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={window.location.href} />
      {title && <meta property="twitter:title" content={`edeXa NFT - ${title}`} />}
      {description && <meta property="twitter:description" content={description} />}
      {/* <meta property="twitter:image" content={thumbnail || explorerThumbnailImage}></meta> */}

      {/* canonical url - current host*/}
      <link rel="canonical" href={window.location.origin} />

      {/* scripts tags */}
      {script && <script src={script} async></script>}

      {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
      {process.env.REACT_APP_ENV === "PRODUCTION" ? (
        <>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-XVRB7YKFLT"></script>
          <script>
            {`window.dataLayer = window.dataLayer || [];
                            function gtag() {dataLayer.push(arguments); }
                            gtag('js', new Date());

                            gtag('config', 'G-XVRB7YKFLT');`}
          </script>
        </>
      ) : null}
    </Helmet>
  );
};

export default React.memo(GlobalHelmetProvider);
