export function RedPolicyAmbient() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -top-32 right-[-8rem] h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "var(--ambient-a)" }}
      />
      <div
        className="absolute top-1/3 left-[-6rem] h-80 w-80 rounded-full blur-3xl"
        style={{ background: "var(--ambient-b)" }}
      />
      <div
        className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "var(--ambient-c)" }}
      />
    </div>
  );
}
