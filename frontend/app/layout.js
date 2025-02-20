import localFont from "next/font/local";
import "./globals.css";

// import StoreProvider from "@/store/StoreProvider";
import Providers from "@/lib/queryClient";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "NFT Scavenger Hunt",
  description: "Solve puzzles and claim NFT rewards!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* <StoreProvider> */}
          <Navbar />
          {children}
          {/* </StoreProvider> */}
        </Providers>
      </body>
    </html>
  );
}
