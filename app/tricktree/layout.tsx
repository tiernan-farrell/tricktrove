import React, { ReactNode } from 'react';
import Link from 'next/link';
import '../globals.css'
interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>
      <div className="tricktreecontent">{children}</div>
    </div>
  );
};


