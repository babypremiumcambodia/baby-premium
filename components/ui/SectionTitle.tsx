interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold">{title}</h2>

      {subtitle && (
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}