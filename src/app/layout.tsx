import type { Metadata } from "next";
import { Anonymous_Pro } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { JournalProvider } from "@/hooks/useJournal";

const anonymousPro = Anonymous_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-anonymous-pro",
});

export const metadata: Metadata = {
  title: "One Year Doodle",
  description: "A daily journal garden - one memory, one doodle per day",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={anonymousPro.variable}>
      <body>
        <AuthProvider>
          <JournalProvider>{children}</JournalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
