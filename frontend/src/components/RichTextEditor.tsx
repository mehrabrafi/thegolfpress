'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, MessageSquareQuote } from 'lucide-react';
import { useEffect } from 'react';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className={styles.toolbar}>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`${styles.toolbarBtn} ${editor.isActive('bold') ? styles.isActive : ''}`}
                title="Bold"
                type="button" // important to prevent form submission
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`${styles.toolbarBtn} ${editor.isActive('italic') ? styles.isActive : ''}`}
                title="Italic"
                type="button"
            >
                <Italic size={18} />
            </button>
            <div style={{ width: '1px', background: '#ccc', margin: '0 5px' }} />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`${styles.toolbarBtn} ${editor.isActive('heading', { level: 1 }) ? styles.isActive : ''}`}
                title="Heading 1"
                type="button"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`${styles.toolbarBtn} ${editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}`}
                title="Heading 2"
                type="button"
            >
                <Heading2 size={18} />
            </button>
            <div style={{ width: '1px', background: '#ccc', margin: '0 5px' }} />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`${styles.toolbarBtn} ${editor.isActive('bulletList') ? styles.isActive : ''}`}
                title="Bullet List"
                type="button"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`${styles.toolbarBtn} ${editor.isActive('orderedList') ? styles.isActive : ''}`}
                title="Ordered List"
                type="button"
            >
                <ListOrdered size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`${styles.toolbarBtn} ${editor.isActive('blockquote') ? styles.isActive : ''}`}
                title="Quote"
                type="button"
            >
                <MessageSquareQuote size={18} />
            </button>
        </div>
    );
};

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
            },
        },
    });

    // Sync external value changes if needed (but care to avoid loops)
    // This is optional and tricky with rich text.
    // Generally, for controlled inputs, we update if value changes externally *drastically* on init mainly.
    // For now, assume value prop is initial value or we handle fully controlled carefully.

    // A simple effect to keep content in sync if the prop changes from outside (like reset form)
    // but only if it's different to prevent cursor jumps
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Check if it's empty to handle form resets gracefully
            if (value === '' && editor.getText() !== '') {
                editor.commands.setContent('');
            }
        }
    }, [value, editor]);


    return (
        <div className={styles.editorWrapper}>
            <MenuBar editor={editor} />
            <div className={styles.editorContent}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default RichTextEditor;
