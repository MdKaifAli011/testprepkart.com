import React from 'react'
import Navigation from '../../components/Navigation'
import './styles.css'

export const metadata = {
  description: 'Educational platform with courses and learning resources.',
  title: 'Testprepkart',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
