import React, { useEffect } from 'react';

const SEO: React.FC<{ title: string, description?: string }> = ({ title, description }) => {
    useEffect(() => {
        document.title = `${title} | Lua Baby`;
        if (description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = description;
                document.head.appendChild(meta);
            }
        }
    }, [title, description]);
    return null;
};

export default SEO;
