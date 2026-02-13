'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, MessageSquareQuote, Image as ImageIcon } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import { uploadImage } from '@/lib/api';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const addImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event: any) => {
            const file = event.target.files?.[0];
            if (file) {
                try {
                    const data = await uploadImage(file);
                    if (data && data.url) {
                        editor.chain().focus().setImage({ src: data.url }).run();
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    alert('Failed to upload image. Please try again.');
                }
            }
        };
        input.click();
    }, [editor]);

    return (
        <div className={styles.toolbar}>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`${styles.toolbarBtn} ${editor.isActive('bold') ? styles.isActive : ''}`}
                title="Bold"
                type="button"
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
            <div style={{ width: '1px', background: '#ccc', margin: '0 5px' }} />
            <button
                onClick={addImage}
                className={styles.toolbarBtn}
                title="Insert Image"
                type="button"
            >
                <ImageIcon size={18} />
            </button>
        </div>
    );
};

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none',
            },
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
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
