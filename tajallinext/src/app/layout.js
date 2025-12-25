import { Geist, Geist_Mono , Poppins } from "next/font/google";
import  "bootstrap/dist/css/bootstrap.min.css"
import AddBootstrap from "./Addbootstrap";
import "./globals.css";
import { AuthProvider } from "@/Context/AuthContext";
import { CartProvider } from "@/Context/CartContext";
import Navbar from "@/Components/Navabar/Navbar";
import Footer from "@/Components/Footer/Footer";
import { OrderProvider } from "@/Context/OrderContext";
import Link from "next/link";
import WhatsAppChatModal from "@/Components/Whatsappchatmodal/Whatsappchatmodal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Buy Premium Dry Fruits, Nuts, Seeds and Berries Online",
  description: "Shop TAJALLI’s finest selection of dry fruits, nuts, seeds, and berries. 100% natural, rich in nutrients, and perfect for a healthy lifestyle. Order now!",
  icons: {
    icon: "/logo.png",  // Ensure you have a favicon.ico file in public folder
    apple: "/logo.png", // Optional for Apple devices
  },
  alternates: {
    canonical: "https://www.tajalli.co.in",
},
  openGraph: {
    title: "Buy Premium Dry Fruits, Nuts, Seeds and Berries Online",
    description: `Shop TAJALLI’s finest selection of dry fruits, nuts, seeds, and berries. 100% natural, rich in nutrients, and perfect for a healthy lifestyle. Order now!`,
    images: "https://res.cloudinary.com/dqa6jk5fx/image/upload/c_scale,w_2200/f_auto/q_60/v1722759470/nltkiyr5lnr3uoldrpef.webp",
}
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`} suppressHydrationWarning>
      <AddBootstrap/>    
      <AuthProvider>
          <CartProvider>
            <OrderProvider>
          <Navbar/>
            {children}
            <Footer/>
            </OrderProvider>
            <Link href="https://wa.me/918826069897" target="_blank" rel="noopener noreferrer">
        <WhatsAppChatModal/></Link>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
