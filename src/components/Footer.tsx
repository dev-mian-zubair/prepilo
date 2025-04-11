import React from "react";
import { Link } from "@heroui/link";

const Footer = () => {
  return (
    <footer className="w-full bg-background py-4 px-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p>
          © {new Date().getFullYear()} Prepilo.{" "}
          <span className="text-accent">Powered by AI</span> to help you
          succeed.
        </p>
        <nav className="flex flex-wrap justify-center gap-4">
          <Link className="text-sm" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="text-sm" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-sm" href="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
