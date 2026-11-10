"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import { adminLabelClass } from "@/components/admin/form-styles";

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded px-2 py-1 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? "bg-primary text-white"
          : "bg-surface text-text hover:bg-muted border border-border"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL tautan", prev ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }

  return (
    <div className="flex flex-wrap gap-1.5 border-b border-border bg-muted/50 px-2 py-2">
      <ToolbarButton
        label="Tebal"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        label="Miring"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        label="Subjudul"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        label="Daftar poin"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        label="Daftar nomor"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </ToolbarButton>
      <ToolbarButton
        label="Tautan"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        Link
      </ToolbarButton>
      <ToolbarButton
        label="Batalkan"
        onClick={() => editor.chain().focus().undo().run()}
      >
        Undo
      </ToolbarButton>
      <ToolbarButton
        label="Ulangi"
        onClick={() => editor.chain().focus().redo().run()}
      >
        Redo
      </ToolbarButton>
    </div>
  );
}

export default function ContentTextField({
  defaultHtml,
  placeholder,
  hint,
}: {
  defaultHtml?: string | null;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  const [html, setHtml] = useState(defaultHtml?.trim() || "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [3] },
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: defaultHtml?.trim() || "",
    editorProps: {
      attributes: {
        class:
          "min-h-48 px-3 py-2.5 text-sm text-text leading-relaxed focus:outline-none prose prose-sm max-w-none [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor: ed }) => {
      setHtml(ed.isEmpty ? "" : ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const next = defaultHtml?.trim() || "";
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false });
      setHtml(next);
    }
    // Hanya sync saat defaultHtml dari server berubah (navigasi edit).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultHtml, editor]);

  return (
    <div>
      <label className={adminLabelClass}>Isi konten</label>
      <div className="overflow-hidden rounded-lg border border-border bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
        {editor ? <Toolbar editor={editor} /> : null}
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name="content" value={html} />
      <p className="mt-2 text-xs text-text-muted">
        Gunakan toolbar untuk tebal, subjudul, daftar, dan tautan.
        {hint ? ` ${hint}` : ""}
      </p>
    </div>
  );
}
