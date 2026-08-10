export default function FaqSection({ faqs }) {
  return (
    <section className="section bg-white" aria-label="Frequently asked questions">
      <div className="section-intro wide-intro">
        <p className="eyebrow">FAQ</p>
        <h2>Frequently asked questions</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {faqs.map(({ question, answer }) => (
          <div key={question} className="rounded-lg border border-line bg-white p-6">
            <h3>{question}</h3>
            <p className="m-0 leading-7 text-subtle">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
