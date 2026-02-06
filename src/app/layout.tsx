import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { JournalProvider } from "@/hooks/useJournal";

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
    <html lang="en">
      <body>
        <AuthProvider>
          <JournalProvider>{children}</JournalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
