import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return & Exchange Policy | Faoo',
  description: 'Faoo Return and Exchange policy. 7-day returns and exchanges for a seamless shopping experience.',
};

export default function ReturnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
