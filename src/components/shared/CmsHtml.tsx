export default function CmsHtml({ html }: { html: string }) {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div
          className="prose prose-slate max-w-none text-text-muted
            prose-headings:font-heading prose-headings:text-primary
            prose-p:leading-relaxed prose-li:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
