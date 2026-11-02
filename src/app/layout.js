import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: { default: "Shomaj Setu | Social Development Events", template: "%s | Shomaj Setu" },
  description: "Create, join and track community service events in your neighbourhood.",
};

// Runs before paint so the saved theme never flashes
const themeScript = `try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'civicdark':'civic'}document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="civic" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${font.className} flex min-h-screen flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: "999px", padding: "10px 18px" } }} />
      </body>
    </html>
  );
}
