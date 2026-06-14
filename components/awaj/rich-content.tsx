/**
 * Renders body content that may be either rich HTML (from the admin editor)
 * or legacy plain text with newline-separated paragraphs.
 */
export function RichContent({ html, className }: { html: string; className?: string }) {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(html)

  if (isHtml) {
    return (
      <div
        className={`rich-content text-navy-text/75 ${className ?? ""}`}
        // Content is authored by authenticated admins only.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <div className={`rich-content text-navy-text/75 ${className ?? ""}`}>
      {html
        .split("\n")
        .filter(Boolean)
        .map((para, i) => (
          <p key={i} className="text-pretty">
            {para}
          </p>
        ))}
    </div>
  )
}
