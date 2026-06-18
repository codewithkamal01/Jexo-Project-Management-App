import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import { checkUser } from "@/lib/checkUser";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jexo",
  description: "Project Management App",
};

export default async function RootLayout({ children }) {
  await checkUser();
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#020617",
          colorText: "#e2e8f0",
          colorInputBackground: "#0f172a",
          colorInputText: "#f8fafc",
        },
        elements: {
          formButtonPrimary: "!text-white bg-blue-900 hover:bg-blue-500",
          formButtonPrimaryText: "!text-white",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} min-h-full flex flex-col dotted-bg`}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
            <footer className="bg-gray-900 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made with ❤️ by Kamal</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
