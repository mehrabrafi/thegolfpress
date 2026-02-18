'use client';

import { useState, useEffect } from 'react';
import { Facebook, Link as LinkIcon, Check } from 'lucide-react';
import styles from './ShareButtons.module.css';

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (url) {
            setShareUrl(url);
        } else if (typeof window !== 'undefined') {
            setShareUrl(window.location.href);
        }
    }, [url]);

    const handleShare = (platform: 'x' | 'facebook') => {
        if (!shareUrl) return;

        let shareLink = '';
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(title);

        if (platform === 'x') {
            shareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        } else if (platform === 'facebook') {
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        }

        window.open(shareLink, '_blank', 'width=600,height=400');
    };

    const handleCopy = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div className={styles.shareSection}>
            <span className={styles.shareLabel}>SHARE:</span>

            {/* X (Twitter) */}
            <button
                onClick={() => handleShare('x')}
                className={`${styles.shareBtn} ${styles.x}`}
                aria-label="Share on X (Twitter)"
            >
                {/* Custom SVG for X Logo */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            </button>

            {/* Facebook */}
            <button
                onClick={() => handleShare('facebook')}
                className={`${styles.shareBtn} ${styles.facebook}`}
                aria-label="Share on Facebook"
            >
                <Facebook size={20} />
            </button>

            {/* Copy Link */}
            <button
                onClick={handleCopy}
                className={`${styles.shareBtn} ${styles.link} ${copied ? styles.copied : ''}`}
                aria-label="Copy link to clipboard"
            >
                {copied ? <Check size={20} /> : <LinkIcon size={20} />}
                {copied && <span className={`${styles.tooltip} ${styles.visible}`}>Copied!</span>}
            </button>
        </div>
    );
}
