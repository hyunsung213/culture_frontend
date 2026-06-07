interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-text-main">{title}</h2>
      {subtitle && <p className="text-sm text-text-sub mt-1">{subtitle}</p>}
    </div>
  );
}
