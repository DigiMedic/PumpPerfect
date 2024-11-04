export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} DigiHealth Analytics. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
} 