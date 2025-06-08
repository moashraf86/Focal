import { Product } from "@/lib/definitions";

// Type for text nodes within a block
type childrenType = { type: string; text: string; bold?: boolean };

// Type for list items (used in list blocks)
type ListItemType = {
  type: string;
  children: childrenType[];
};

// Type for blocks (paragraph or list)
type blockType = {
  type: string;
  children: childrenType[] | ListItemType[];
  format?: string;
};

export default function ProductDescription({
  description,
}: {
  description: Product["description"];
}) {
  const renderChildren = (children: childrenType[]) => {
    return children.map((child, i) => (
      <span key={i} style={{ fontWeight: child.bold ? "bold" : "normal" }}>
        {child.text}
      </span>
    ));
  };

  const renderBlock = (block: blockType, index: number) => {
    if (block.type === "paragraph") {
      return (
        <p key={index}>{renderChildren(block.children as childrenType[])}</p>
      );
    }

    if (block.type === "list") {
      const ListTag = block.format === "ordered" ? "ol" : "ul";
      return (
        <ListTag
          key={index}
          className="pl-5 space-y-1 list-disc marker:text-gray-500"
        >
          {(block.children as ListItemType[]).map((item, i) => (
            <li key={i}>{renderChildren(item.children)}</li>
          ))}
        </ListTag>
      );
    }

    return null;
  };

  return <div className="space-y-4">{description.map(renderBlock)}</div>;
}
