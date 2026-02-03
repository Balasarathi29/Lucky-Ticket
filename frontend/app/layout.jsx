
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Lucky Ticket - Redeem Your Reward",
    description: "Redeem your lucky ticket and convert it into points instantly.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
                <div className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
