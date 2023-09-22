'use client'

import store from '@/store/store';
import { Provider } from 'react-redux';
import { persistor } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import Script from 'next/script';
import './globals.css';
import 'tailwindcss/tailwind.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{overflowY: 'hidden'}}>
      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      <Script src="../path/to/flowbite/dist/flowbite.min.js"></Script>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/2.3.0/alpine-ie11.js" integrity="sha512-6m6AtgVSg7JzStQBuIpqoVuGPVSAK5Sp/ti6ySu6AjRDa1pX8mIl1TwP9QmKXU+4Mhq/73SzOk6mbNvyj9MPzQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></Script>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/2.3.0/alpine-ie11.min.js" integrity="sha512-Atu8sttM7mNNMon28+GHxLdz4Xo2APm1WVHwiLW9gW4bmHpHc/E2IbXrj98SmefTmbqbUTOztKl5PDPiu0LD/A==" crossorigin="anonymous" referrerpolicy="no-referrer"></Script>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/2.3.0/alpine-ie11.min.js" integrity="sha512-Atu8sttM7mNNMon28+GHxLdz4Xo2APm1WVHwiLW9gW4bmHpHc/E2IbXrj98SmefTmbqbUTOztKl5PDPiu0LD/A==" crossorigin="anonymous" referrerpolicy="no-referrer"></Script>
      <link rel="icon" href="/icon.ico" sizes="any" />
      </body>
    </html>
  )
}
