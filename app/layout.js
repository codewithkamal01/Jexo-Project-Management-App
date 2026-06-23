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
          <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-md">
  <div className="container mx-auto px-3 py-4 flex flex-col items-center text-center space-y-3">
    <h3 className="text-xl font-semibold gradient-title pb-2 m-0">Jexo</h3>
    <p className="text-sm text-slate-400 max-w-lg">
      Streamline your workflow. Manage projects, sprints, and issues in one place.
    </p>

    <div className="text-sm text-slate-500">
      © {new Date().getFullYear()} Jexo • Built with ❤️ by Kamal
    </div>
    
  </div>
</footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
