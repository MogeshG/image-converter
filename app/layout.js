import "./globals.css";

export const metadata = {
  title: "Image Format Changer",
  description: "Best website to convert image format with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`jersey-15-regular antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
