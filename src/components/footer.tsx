export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-gray sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} TPointic — Tales Pereira</p>
        <div className="flex flex-wrap gap-x-4">
          <a href="mailto:contatodotales@gmail.com" className="hover:text-coral">
            contatodotales@gmail.com
          </a>
          <a href="tel:+5511986303369" className="hover:text-coral">
            (11) 98630-3369
          </a>
          <a
            href="https://linkedin.com/in/talespereira/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-coral"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
