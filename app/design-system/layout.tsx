export default function DesignSystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="ds-vision flex min-h-dvh min-h-full flex-1 flex-col bg-[var(--vision-canvas)] text-[var(--vision-text)]">
      {children}
    </div>
  );
}
