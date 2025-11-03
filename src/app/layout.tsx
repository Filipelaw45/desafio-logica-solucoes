import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gerenciador de Usuários - Desafio Lógica Soluções',
  description:
    'Sistema de gerenciamento de usuários com integração à API Random User, armazenamento em CSV, e funcionalidades de busca, edição e exclusão.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br'>
      <body className='antialiased'
      cz-shortcut-listen="true">{children}</body>
    </html>
  );
}
