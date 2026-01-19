async function loadMarkdown() {
    try {
        const response = await fetch('preset copy.md');
        const rawText = await response.text();
        
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = rawText.match(frontMatterRegex);

        let title = "TITLE";
        let body = rawText;

        if (match) {
            const frontMatter = match[1];
            body = rawText.replace(match[0], '');

            const getField = (field) => {
                const regex = new RegExp(`${field}:\\s*(.*)`);
                const res = frontMatter.match(regex);
                return res ? res[1].trim() : null;
            };

            title = getField('title') || title;
            author = getField('author') || author;
            date = getField('date') || date;

            const catMatch = frontMatter.match(/categories:\s*\[(.*?)\]/);
            if (catMatch) {
                categories = catMatch[1].split(',').map(item => item.trim());
            }
        }

        // TITLE
        document.title = title + " : JWN's Blog";
        const headerTitleElement = document.querySelector('.header-title');
        if (headerTitleElement) headerTitleElement.innerText = title;

        // CATEGORY
        const headerMenuElement = document.querySelector('.header-menu');
        if (headerMenuElement && categories.length > 0) {
            headerMenuElement.innerHTML = '';

            categories.forEach((cat, index) => {
                const catSpan = document.createElement('span');
                catSpan.className = 'category link';
                catSpan.innerText = cat;
                headerMenuElement.appendChild(catSpan);

                if (index < categories.length - 1) {
                    const separator = document.createElement('span');
                    separator.className = 'category';
                    separator.innerText = ' / ';
                    headerMenuElement.appendChild(separator);
                }
            });
        }

        // DATE
        const dateElement = document.querySelector('.date');
        if (dateElement) dateElement.innerText = `by ${author} :: ${date}`;

        // MAIN
        const contentElement = document.querySelector('main'); 
        let htmlContent = marked.parse(body);

        htmlContent = htmlContent.replace(/(?<!\$)\$([^$]+)\$(?!\$)/g, (match, p1) => {
            if (p1.includes('\\textstyle') || p1.includes('\\displaystyle')) {
                return match; 
            }
            return `$\\displaystyle ${p1}$`;
        });

        contentElement.innerHTML = htmlContent;

        // LaTex
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise(); 
        }
    } catch (error) {
        console.error('ERROR: ', errer);
    }
}

loadMarkdown();