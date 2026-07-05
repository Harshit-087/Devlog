const accentMap = {
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  violet: "text-violet-400",
} as const;

export function Section({
  icon,
  accent,
  label,
  children,
}: {
  icon: React.ReactNode;
  accent: keyof typeof accentMap;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className={`flex items-center gap-2 mb-3.5 ${accentMap[accent]}`}>
        {icon}
        <h4 className="text-[13px] font-semibold uppercase tracking-wide">{label}</h4>
      </div>
      {children}
    </div>
  );
}