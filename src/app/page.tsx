import { Button } from "@heroui/button";
import Link from "next/link";

import { title, subtitle } from "@/src/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Master </span>
        <span className={title({ color: "violet" })}>your </span>
        <br />
        <span className={title()}>interviews with AI precision.</span>
        <div className={subtitle({ class: "mt-4" })}>
          Real-time feedback to sharpen your skills instantly.
        </div>
      </div>

      <div className="mt-8">
        <Button
          as={Link}
          color="primary"
          href="/interviews"
          size="lg"
          variant="solid"
        >
          Get Started
        </Button>
      </div>
    </section>
  );
}
