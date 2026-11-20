type Props = { eyebrow: string; title: string; subtitle?: string };

export default function SectionHeading({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}