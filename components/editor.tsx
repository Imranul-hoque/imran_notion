"use client";

import { FC } from "react";
import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { useEdgeStore } from '@/lib/edgestore';
import { useTheme } from 'next-themes';


interface EditorProps {
    initialContent?: string;
    editable?: boolean; 
    onChange : (value : string) => void
}

const Editor: FC<EditorProps> = ({ initialContent, onChange, editable }) => {

    const { edgestore } = useEdgeStore();
    const { resolvedTheme } = useTheme();


    const handler = async (file: File) => {
        const response = await edgestore.publicFiles.upload({ file })
        return response.url
    }
    const editor: BlockNoteEditor = useBlockNote({
      editable,
      initialContent: initialContent
        ? (JSON.parse(initialContent) as PartialBlock[])
        : undefined,
      onEditorContentChange: (editor) => {
        onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
      },
      uploadFile: handler,
    });

    return (
      <div>
        <BlockNoteView
          editor={editor}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
      </div>
    );
}
 
export default Editor;