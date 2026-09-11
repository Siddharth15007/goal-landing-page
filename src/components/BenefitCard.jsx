export default function BenefitCard({ num, title, body, featured = false, delayClass = '' }) {
  const cardClasses = ['card', featured ? 'card-featured' : '', delayClass]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClasses}>
      <div className="card-num">{num}</div>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="card-corner" aria-hidden="true"></div>
    </article>
  )
}
