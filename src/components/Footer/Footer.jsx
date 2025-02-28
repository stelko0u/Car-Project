export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="p-4 bg-zinc-900 text-white">
      <div className="container mx-auto text-center">© {year} CarDeals. All rights reserved.</div>
    </footer>
  );
}
