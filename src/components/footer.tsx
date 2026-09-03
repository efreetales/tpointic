import { Mail, Telephone, Linkedin } from "@mynaui/icons-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-gray sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} TPointic — Tales Pereira</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a
            href="mailto:contatodotales@gmail.com"
            className="flex items-center gap-1.5 transition-colors hover:text-coral"
          >
            <Mail size={16} /> contatodotales@gmail.com
          </a>
          <a
            href="tel:+5511986303369"
            className="flex items-center gap-1.5 transition-colors hover:text-coral"
          >
            <Telephone size={16} /> (11) 98630-3369
          </a>
          <a
            href="https://linkedin.com/in/talespereira/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-coral"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
