'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface ArticleContentProps {
  content: string;
  className?: string;
}

/**
 * Renders article content.
 * Supports both legacy Markdown (from MDXEditor) and new HTML (from TipTap).
 * Detects format automatically: if content starts with a block-level HTML tag,
 * it renders as HTML. Otherwise, it renders as Markdown with raw HTML passthrough.
 */
export default function ArticleContent({
  content,
  className = '',
}: ArticleContentProps) {
  if (!content) return null;

  // Detect if content is HTML (starts with a block HTML tag or <div, <p, <h1, etc.)
  const isHtml = /^<(div|p|h[1-6]|section|article|figure|ul|ol|blockquote|table|video|iframe|img)[\s>]/i.test(content.trim());

  if (isHtml) {
    return (
      <div
        className={`article-content ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Legacy markdown rendering
  return (
    <div className={`article-content ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          /* ---- Headings ---- */
          h1: ({ children, ...props }) => (
            <h1
              className="font-oswald font-bold text-[28px] sm:text-[32px] text-pure-black dark:text-white mt-10 mb-4 leading-[1.2] first:mt-0"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="font-oswald font-bold text-[24px] sm:text-[26px] text-pure-black dark:text-white mt-8 mb-3 leading-[1.25] first:mt-0"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="font-oswald font-bold text-[20px] sm:text-[22px] text-pure-black dark:text-white mt-7 mb-3 leading-[1.3] first:mt-0"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="font-oswald font-bold text-[18px] text-graphite dark:text-cloud mt-6 mb-2 leading-[1.3] first:mt-0"
              {...props}
            >
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5
              className="font-roboto font-bold text-[16px] text-graphite dark:text-cloud mt-5 mb-2 leading-[1.4] first:mt-0"
              {...props}
            >
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6
              className="font-roboto font-bold text-[14px] text-iron dark:text-ash uppercase tracking-wider mt-5 mb-2 leading-[1.4] first:mt-0"
              {...props}
            >
              {children}
            </h6>
          ),

          /* ---- Paragraphs ---- */
          p: ({ children, ...props }) => (
            <p
              className="text-[16px] font-roboto text-graphite dark:text-cloud leading-[1.8] mb-4 last:mb-0"
              {...props}
            >
              {children}
            </p>
          ),

          /* ---- Links ---- */
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-brand-blue dark:text-brand-blue-light underline underline-offset-2 hover:no-underline transition-all"
              {...props}
            >
              {children}
            </a>
          ),

          /* ---- Inline formatting ---- */
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-pure-black dark:text-white" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic" {...props}>
              {children}
            </em>
          ),
          u: ({ children, ...props }) => (
            <u className="underline underline-offset-2" {...props}>
              {children}
            </u>
          ),
          del: ({ children, ...props }) => (
            <del className="line-through opacity-70" {...props}>
              {children}
            </del>
          ),

          /* ---- Blockquote ---- */
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-3 border-brand-blue pl-5 py-1 my-6 bg-brand-blue/5 rounded-r-[2px]"
              {...props}
            >
              {children}
            </blockquote>
          ),

          /* ---- Lists ---- */
          ul: ({ children, ...props }) => (
            <ul
              className="my-4 ml-6 space-y-1.5 list-disc marker:text-brand-blue"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="my-4 ml-6 space-y-1.5 list-decimal marker:text-brand-blue marker:font-bold"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li
              className="text-[16px] font-roboto text-graphite dark:text-cloud leading-[1.7]"
              {...props}
            >
              {children}
            </li>
          ),

          /* ---- Code ---- */
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-paper dark:bg-white/8 text-brand-blue text-[14px] px-1.5 py-0.5 rounded-[2px] font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className} text-[13px] font-mono`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre
              className="bg-paper dark:bg-obsidian border border-mist dark:border-white/10 rounded-[2px] p-5 my-6 overflow-x-auto"
              {...props}
            >
              {children}
            </pre>
          ),

          /* ---- Images ---- */
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt || ''}
              className="w-full h-auto rounded-[2px] my-6 border border-mist dark:border-white/10"
              loading="lazy"
              {...props}
            />
          ),

          /* ---- Tables ---- */
          table: ({ children, ...props }) => (
            <div className="my-6 overflow-x-auto border border-mist dark:border-white/10 rounded-[2px]">
              <table className="w-full text-[14px] font-roboto" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-paper dark:bg-white/5" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              className="text-left px-4 py-3 font-bold text-pure-black dark:text-white border-b border-mist dark:border-white/10"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-4 py-3 text-graphite dark:text-cloud border-b border-mist dark:border-white/5 last:border-b-0"
              {...props}
            >
              {children}
            </td>
          ),

          /* ---- Horizontal rule ---- */
          hr: (props) => (
            <hr
              className="my-8 border-none border-t border-mist dark:border-white/15"
              {...props}
            />
          ),

          /* ---- Mark / Highlight ---- */
          mark: ({ children, ...props }) => (
            <mark
              className="bg-accent-yellow-solid/40 dark:bg-accent-yellow-solid/30 px-1 rounded-[1px]"
              {...props}
            >
              {children}
            </mark>
          ),

          /* ---- Video (HTML passthrough from embeds) ---- */
          video: ({ src, children, ...props }) => (
            <video
              src={src}
              controls
              className="w-full max-h-[500px] rounded-[2px] my-6 border border-mist dark:border-white/10"
              {...props}
            >
              {children}
            </video>
          ),

          /* ---- Iframe (embed passthrough) ---- */
          iframe: ({ src, width, height, ...props }) => (
            <div className="my-6 aspect-video w-full max-w-full">
              <iframe
                src={src}
                width={width || '100%'}
                height={height || '100%'}
                className="w-full h-full rounded-[2px] border-0"
                allowFullScreen
                title="Contenu embarqué"
                {...props}
              />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}