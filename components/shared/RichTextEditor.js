
"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Minus,
  Quote,
} from "lucide-react";

export default function RichTextEditor({
  label = "Content",
  value = "",
  onChange,
  placeholder = "Write your content...",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Keep the editor synchronized with the parent form.
  useEffect(() => {
    if (!editor) return;

    const currentValue = value || "";

    if (editor.getHTML() !== currentValue) {
      editor.commands.setContent(currentValue, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-60 animate-pulse rounded-lg border border-gray-200 bg-gray-50" />
    );
  }

  const toolbarButtons = [
    {
      label: "Heading 2",
      icon: Heading2,
      active: editor.isActive("heading", { level: 2 }),
      action: () =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Heading 3",
      icon: Heading3,
      active: editor.isActive("heading", { level: 3 }),
      action: () =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Bold",
      icon: Bold,
      active: editor.isActive("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: Italic,
      active: editor.isActive("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Strikethrough",
      icon: Strikethrough,
      active: editor.isActive("strike"),
      action: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "Bullet List",
      icon: List,
      active: editor.isActive("bulletList"),
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered List",
      icon: ListOrdered,
      active: editor.isActive("orderedList"),
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Blockquote",
      icon: Quote,
      active: editor.isActive("blockquote"),
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Horizontal Rule",
      icon: Minus,
      active: false,
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-gray-700">
          {label}
        </label>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
        <div
          className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2"
          role="toolbar"
          aria-label={`${label} formatting toolbar`}
        >
          {toolbarButtons.map((button) => {
            const Icon = button.icon;

            return (
                <button
                key={button.label}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                title={button.label}
                aria-label={button.label}
                aria-pressed={button.active}
                disabled={button.disabled}
                onClick={button.action}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
                  button.active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-200"
                } disabled:cursor-not-allowed disabled:opacity-30`}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>

        <div className="editor-scroll-area">
  <EditorContent
    editor={editor}
    className="tiptap-editor px-4 py-3 text-sm text-gray-900"
  />
</div>

        <div className="border-t border-gray-100 bg-gray-50 px-3 py-2">
          <p className="text-[11px] text-gray-500">
            Format your content with headings, emphasis, lists, and quotations.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .editor-scroll-area {
  box-sizing: border-box;
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
}

.editor-scroll-area .tiptap-editor {
  min-height: 100%;
}

.tiptap-editor .tiptap {
  box-sizing: border-box;
  min-height: 100%;
  outline: none;
  overflow-wrap: anywhere;
}

        .tiptap-editor .tiptap p {
          margin: 0.5rem 0;
          line-height: 1.75;
        }

        .tiptap-editor .tiptap h2 {
          margin: 1.25rem 0 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .tiptap-editor .tiptap h3 {
          margin: 1rem 0 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .tiptap-editor .tiptap ul {
          margin: 0.75rem 0;
          list-style: disc;
          padding-left: 1.5rem;
        }

        .tiptap-editor .tiptap ol {
          margin: 0.75rem 0;
          list-style: decimal;
          padding-left: 1.5rem;
        }

        .tiptap-editor .tiptap blockquote {
          margin: 1rem 0;
          border-left: 3px solid #d1d5db;
          padding-left: 1rem;
          color: #6b7280;
        }

        .tiptap-editor .tiptap hr {
          margin: 1rem 0;
          border-color: #e5e7eb;
        }

        .tiptap-editor .tiptap strong {
          font-weight: 700;
        }

        .tiptap-editor .tiptap em {
          font-style: italic;
        }

        .tiptap-editor .tiptap s {
          text-decoration: line-through;
        }

        .tiptap-editor .tiptap p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
