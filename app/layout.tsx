import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main style={{ minHeight: "80vh", padding: "20px" }}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}