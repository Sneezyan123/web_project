"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RichTextInputProps = {
  name: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  required?: boolean;
};

const toolbar = [
  { id: "bold", icon: "/figma-assets/editor-bold.svg", title: "Жирний" },
  { id: "italic", icon: "/figma-assets/editor-italic.svg", title: "Курсив" },
  { id: "h2", icon: "/figma-assets/editor-h2.svg", title: "Заголовок" },
  { id: "quote", icon: "/figma-assets/editor-quote.svg", title: "Цитата" },
  { id: "link", icon: "/figma-assets/editor-link.svg", title: "Посилання" },
] as const;

type ActionId = (typeof toolbar)[number]["id"];

export function RichTextInput({ name, placeholder, className, maxLength, required }: RichTextInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("");
  const [active, setActive] = useState<Record<ActionId, boolean>>({
    bold: false,
    italic: false,
    h2: false,
    quote: false,
    link: false,
  });

  const plainTextLength = useMemo(() => {
    if (!editorRef.current) return 0;
    return editorRef.current.innerText.length;
  }, [html]);

  function refreshToolbar() {
    const isBold = document.queryCommandState("bold");
    const isItalic = document.queryCommandState("italic");
    const block = (document.queryCommandValue("formatBlock") || "").toString().toLowerCase();
    const isLink = document.queryCommandState("createLink");
    setActive({
      bold: isBold,
      italic: isItalic,
      h2: block.includes("h2"),
      quote: block.includes("blockquote"),
      link: isLink,
    });
  }

  useEffect(() => {
    const onSelectionChange = () => refreshToolbar();
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  function handleInput() {
    const editor = editorRef.current;
    if (!editor) return;
    if (maxLength && editor.innerText.length > maxLength) {
      editor.innerText = editor.innerText.slice(0, maxLength);
    }
    setHtml(editor.innerHTML);
    refreshToolbar();
  }

  function runCommand(action: ActionId) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    if (action === "bold") document.execCommand("bold");
    if (action === "italic") document.execCommand("italic");
    if (action === "h2") {
      const isActive = (document.queryCommandValue("formatBlock") || "").toString().toLowerCase().includes("h2");
      document.execCommand("formatBlock", false, isActive ? "p" : "h2");
    }
    if (action === "quote") {
      const isActive = (document.queryCommandValue("formatBlock") || "").toString().toLowerCase().includes("blockquote");
      document.execCommand("formatBlock", false, isActive ? "p" : "blockquote");
    }
    if (action === "link") {
      const current = window.getSelection()?.toString().trim();
      const url = window.prompt("Вставте URL посилання", "https://");
      if (url && current) {
        document.execCommand("createLink", false, url);
      }
    }

    setHtml(editor.innerHTML);
    refreshToolbar();
  }

  return (
    <div className={`rounded-[8px] border-2 border-[#bbdbf8] ${className ?? ""}`}>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="h-[124px] w-full overflow-y-auto rounded-t-[6px] p-3 text-base outline-none empty:before:text-[#9da8b2] empty:before:content-[attr(data-placeholder)]"
        data-placeholder={placeholder ?? ""}
        suppressContentEditableWarning
      />
      <input name={name} value={html} onChange={() => {}} required={required} type="hidden" />
      <div className="flex items-center gap-3 px-4 pb-3">
        {toolbar.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => runCommand(item.id)}
            aria-label={item.title}
            title={item.title}
            className={`grid h-[26px] w-[26px] place-items-center rounded-[6px] ${active[item.id] ? "bg-[#d4e7fa]" : ""}`}
          >
            <img src={item.icon} alt="" className="h-4 w-4" />
          </button>
        ))}
        {maxLength ? <span className="ml-auto text-xs text-[#9da8b2]">{plainTextLength}/{maxLength}</span> : null}
      </div>
    </div>
  );
}
