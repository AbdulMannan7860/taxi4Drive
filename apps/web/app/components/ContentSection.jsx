export default function ContentSection({ heading, children, tone = "white" }) {
  return (
    <section className={`section ${tone === "white" ? "bg-white" : ""}`}>
      <div className="section-intro wide-intro">
        <h2>{heading}</h2>
        <div className="mt-4 grid max-w-2xl gap-4 text-lg leading-8 text-muted">{children}</div>
      </div>
    </section>
  );
}
