export default function PageHeader({ title, subtitle, children }) {
  return (
    <section className="bg-mesh border-b border-base-300/60">
      <div className="container-x flex flex-col items-start justify-between gap-4 py-12 sm:flex-row sm:items-end">
        <div>
          <h1 className="section-title">{title}</h1>
          {subtitle && <p className="section-sub">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
