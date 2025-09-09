import './globals.css'

export const metadata = {
  title: '구리 성광교회 LMTC 4기 바자회',
  description: '구리 성광교회 LMTC 4기 바자회 온라인 쇼핑몰',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}