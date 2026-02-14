import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'The Golf Press',
        short_name: 'Golf Press',
        description: 'The definitive voice in golf. Live scores, expert instruction, course reviews, and premium golf news.',
        start_url: '/',
        display: 'standalone',
        background_color: '#f6f6f6',
        theme_color: '#121212',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
