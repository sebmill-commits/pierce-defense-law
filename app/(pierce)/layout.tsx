import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileCallBar from "@/components/layout/MobileCallBar";

export default function PierceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="pb-20 lg:pb-0">{children}</main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
