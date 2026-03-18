// pages/_document.js

import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    const site = ctx.req?.headers['x-site'] || 'nspdm'

    return {
      ...initialProps,
      site
    }
  }

  render() {
    const { site } = this.props

    const counterId =
      site === 'nspdmap'
        ? 107959089
        : 107545302

    return (
      <Html lang="ru">
        <Head />
        <body>
          <Main />
          <NextScript />

          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                k=e.createElement(t),a=e.getElementsByTagName(t)[0];
                k.async=1;k.src=r;a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(${counterId}, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
              `
            }}
          />

          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${counterId}`}
                style={{ position: 'absolute', left: '-9999px' }}
                alt=""
              />
            </div>
          </noscript>

        </body>
      </Html>
    )
  }
}