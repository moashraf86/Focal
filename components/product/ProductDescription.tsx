import { Product } from "@/lib/definitions";
import React from "react";

// Import the StrapiRichText type
import type { StrapiRichText } from "@/lib/definitions";

// Extend StrapiRichText to allow optional fields for rich text node types
interface NodeWithPossibleFields extends StrapiRichText {
  level?: number;
  text?: string;
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  url?: string;
  format?: string;
  image?: {
    url: string;
    height: number;
    width: number;
    alternativeText: string;
  };
}

function resolveRichText(nodes: StrapiRichText[]): string {
  return nodes
    .map((c) => resolveRichTextNode(c as NodeWithPossibleFields))
    .join("");
}

function resolveRichTextNode(node: NodeWithPossibleFields): string {
  let html = "";
  const children =
    node.children
      ?.map((c) => resolveRichTextNode(c as NodeWithPossibleFields))
      .join("") ?? "";

  switch (node.type) {
    case "heading":
      html = `<h${node.level} class="font-inter uppercase text-xl font-light">${children}</h${node.level}>`;
      break;
    case "text":
      if (node.text) {
        let tmp = node.text.replaceAll("\n", "<br />");
        if (node.bold) tmp = `<b>${tmp}</b>`;
        if (node.code) tmp = `<code>${tmp}</code>`;
        if (node.italic) tmp = `<i>${tmp}</i>`;
        if (node.strikethrough) tmp = `<s>${tmp}</s>`;
        if (node.underline) tmp = `<u>${tmp}</u>`;
        html = tmp;
      }
      break;
    case "paragraph":
      html = `<p>${children}</p>`;
      break;
    case "link":
      html = `<a href="${node.url}">${children}</a>`;
      break;
    case "list":
      switch (node.format) {
        case "ordered":
          html = `<ol class="list-decimal pl-5 space-y-1 marker:text-gray-900">${children}</ol>`;
          break;
        case "unordered":
          html = `<ul class="list-disc pl-5 space-y-1 marker:text-gray-900">${children}</ul>`;
          break;
      }
      break;
    case "list-item":
      html = `<li >${children}</li>`;
      break;
    case "quote":
      html = `<blockquote>${children}</blockquote>`;
      break;
    case "code":
      html = `<pre>${children}</pre>`;
      break;
    case "image":
      if (node.image) {
        html = `<img src="${node.image.url}" height="${node.image.height}" width="${node.image.width}" alt="${node.image.alternativeText}" />`;
      }
      break;
  }
  return html;
}

export default function ProductDescription({
  description,
}: {
  description: Product["description"];
}) {
  return (
    <div
      className="space-y-4"
      dangerouslySetInnerHTML={{ __html: resolveRichText(description) }}
    />
  );
}
