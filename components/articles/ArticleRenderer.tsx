import React from 'react';
import Image from 'next/image';
import { FloralAccent } from '../decorations/FloralAccent';

interface ArticleRendererProps {
  content: any;
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
  if (!content) {
    return <p className="italic text-brown-muted">No content available.</p>;
  }

  // If content is stored as an HTML string
  if (typeof content === 'string') {
    return (
      <div
        className="prose-literary font-sans text-brown-dark/90 dark:text-night-text text-lg sm:text-[19px] leading-[1.8] space-y-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // If content is stored as TipTap JSON document
  if (typeof content === 'object' && Array.isArray(content.content)) {
    const nodes = content.content;

    return (
      <div className="prose-literary font-sans text-brown-dark/90 dark:text-night-text text-lg sm:text-[19px] leading-[1.85] space-y-7">
        {nodes.map((node: any, idx: number) => {
          // Render Node by Type
          switch (node.type) {
            case 'paragraph': {
              const text = renderTextMarks(node.content);
              if (!text) return null;
              return (
                <p key={idx} className="relative">
                  {text}
                </p>
              );
            }

            case 'heading': {
              const level = node.attrs?.level || 2;
              const text = renderTextMarks(node.content);
              const id = typeof text === 'string' ? slugifyText(text) : undefined;

              if (level === 1) {
                return (
                  <h1 key={idx} id={id} className="font-serif text-3xl sm:text-4xl font-bold text-brown-deep dark:text-night-text pt-6 pb-2 scroll-mt-24">
                    {text}
                  </h1>
                );
              }
              if (level === 2) {
                return (
                  <h2 key={idx} id={id} className="font-serif text-2xl sm:text-3xl font-bold text-brown-deep dark:text-night-text pt-6 pb-2 border-b border-paper-border/40 dark:border-night-border/40 scroll-mt-24 flex items-center justify-between">
                    <span>{text}</span>
                    <FloralAccent size={22} variant="sparkle" className="opacity-40" />
                  </h2>
                );
              }
              return (
                <h3 key={idx} id={id} className="font-serif text-xl sm:text-2xl font-semibold text-brown-deep dark:text-night-text pt-4 pb-1 scroll-mt-24">
                  {text}
                </h3>
              );
            }

            case 'blockquote': {
              return (
                <div key={idx} className="my-8 relative pl-6 sm:pl-8 border-l-4 border-rose-muted py-2 bg-paper-cream/50 dark:bg-night-card/40 rounded-r-2xl pr-6">
                  <span className="font-serif text-4xl text-rose-muted/50 leading-none select-none -ml-4 block">“</span>
                  <blockquote className="font-serif text-xl sm:text-2xl italic font-normal text-brown-deep dark:text-night-text leading-relaxed">
                    {node.content?.map((sub: any, sIdx: number) => (
                      <p key={sIdx}>{renderTextMarks(sub.content)}</p>
                    ))}
                  </blockquote>
                </div>
              );
            }

            case 'bulletList': {
              return (
                <ul key={idx} className="list-disc list-inside space-y-2 pl-2 text-brown-dark/85 dark:text-night-muted">
                  {node.content?.map((item: any, iIdx: number) => (
                    <li key={iIdx} className="leading-relaxed">
                      {item.content?.map((sub: any, sIdx: number) => (
                        <span key={sIdx}>{renderTextMarks(sub.content)}</span>
                      ))}
                    </li>
                  ))}
                </ul>
              );
            }

            case 'orderedList': {
              return (
                <ol key={idx} className="list-decimal list-inside space-y-2 pl-2 text-brown-dark/85 dark:text-night-muted">
                  {node.content?.map((item: any, iIdx: number) => (
                    <li key={iIdx} className="leading-relaxed">
                      {item.content?.map((sub: any, sIdx: number) => (
                        <span key={sIdx}>{renderTextMarks(sub.content)}</span>
                      ))}
                    </li>
                  ))}
                </ol>
              );
            }

            case 'image': {
              const src = node.attrs?.src;
              const alt = node.attrs?.alt || 'Article visual';
              const title = node.attrs?.title;
              if (!src) return null;

              return (
                <figure key={idx} className="my-8 paper-card p-3 overflow-hidden">
                  <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-paper-blush/30">
                    <Image src={src} alt={alt} fill className="object-cover" />
                  </div>
                  {title && (
                    <figcaption className="text-center font-handwriting text-base text-brown-muted dark:text-night-muted mt-3">
                      {title}
                    </figcaption>
                  )}
                </figure>
              );
            }

            case 'horizontalRule': {
              return (
                <div key={idx} className="my-10 flex items-center justify-center gap-4 text-rose-muted/50">
                  <div className="h-[1px] w-24 bg-paper-border dark:bg-night-border" />
                  <FloralAccent size={24} variant="branch" />
                  <div className="h-[1px] w-24 bg-paper-border dark:bg-night-border" />
                </div>
              );
            }

            default:
              return null;
          }
        })}
      </div>
    );
  }

  return null;
}

function renderTextMarks(content?: any[]): React.ReactNode {
  if (!content) return null;

  return content.map((item, idx) => {
    if (item.type === 'text') {
      let textNode: React.ReactNode = item.text;

      if (item.marks) {
        item.marks.forEach((mark: any) => {
          if (mark.type === 'bold') {
            textNode = <strong key={mark.type} className="font-semibold text-brown-deep dark:text-night-text">{textNode}</strong>;
          }
          if (mark.type === 'italic') {
            textNode = <em key={mark.type} className="italic">{textNode}</em>;
          }
          if (mark.type === 'underline') {
            textNode = <u key={mark.type} className="underline underline-offset-4 decoration-rose-muted/50">{textNode}</u>;
          }
          if (mark.type === 'strike') {
            textNode = <s key={mark.type} className="line-through opacity-70">{textNode}</s>;
          }
          if (mark.type === 'link') {
            textNode = (
              <a
                key={mark.type}
                href={mark.attrs?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-muted dark:text-rose-dusty hover:underline font-medium"
              >
                {textNode}
              </a>
            );
          }
        });
      }

      return <React.Fragment key={idx}>{textNode}</React.Fragment>;
    }

    return null;
  });
}

function slugifyText(text: any): string {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
}
