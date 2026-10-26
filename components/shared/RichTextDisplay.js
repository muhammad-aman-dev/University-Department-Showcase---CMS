
"use client";

import DOMPurify from "isomorphic-dompurify";

export default function RichTextDisplay({
  content = "",
  className = "",
}) {
  const sanitizedHtml = DOMPurify.sanitize(
    typeof content === "string" ? content : ""
  );

  return (
    <div className={`rich-text-display ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </div>
  );
}
