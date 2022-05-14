import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { initializeIcons } from '@fluentui/font-icons-mdl2';


function MyApp({ Component, pageProps }: AppProps) {
  initializeIcons();
  return <Component {...pageProps} />
}

export default MyApp
