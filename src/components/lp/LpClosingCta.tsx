import WhatsappCta from "@/components/shared/WhatsappCta";

interface LpClosingCtaProps {
  title: string;
  description: string;
  ctaText: string;
}

export default function LpClosingCta({
  title,
  description,
  ctaText,
}: LpClosingCtaProps) {
  return (
    <section className="py-14 md:py-20 bg-primary text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
          {title}
        </h2>
        <p className="text-white/75 leading-relaxed mb-8 max-w-xl mx-auto">
          {description}
        </p>
        <WhatsappCta ctaLabel="footer_wa" className="text-base px-6 py-3.5">
          {ctaText}
        </WhatsappCta>
      </div>
    </section>
  );
}
