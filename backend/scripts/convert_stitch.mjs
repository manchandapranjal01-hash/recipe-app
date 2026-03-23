import fs from 'fs/promises';
import path from 'path';

const screens = [
    { title: 'Give Review', filename: 'GiveReview', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzUzOWZhYmM2YTgxZDQ2YjFiMDY5NzBiZWZkNzk1NjliEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Add New Recipe', filename: 'AddNewRecipe', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2FiN2ZkOTFhZWZjOTQzYjFiMDdjYTYyNWI4NjdlYTg1EgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Edit Admin Profile', filename: 'EditAdminProfile', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzMyNTkzZDE4YWM5NTRmNzg5MDg3ODFkNDUxM2U4NjIyEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Grocery Finder', filename: 'GroceryFinder', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QwNzVjODdjYjIyMTQ3Nzc4MThjYWIxYzE4ZjhlZWJlEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'User Profile', filename: 'UserProfile', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2NkZmJhMzFlMDU3YzQ1YTNhZmYwMjQ1MjJhNzg1OGY3EgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'User Details', filename: 'UserDetails', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzE5YzAzMTFiMmNjZTRlYTU4NjgxZmM4MmRjNmNkNmU0EgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Manage Grocery Stores', filename: 'ManageGroceryStores', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzkxYzkyNjgzYmVkMTQ1NTdhNWU3OWRhNTEzMDM3MjhmEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Admin Profile', filename: 'AdminProfile', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2I1MTFjNjg1ZmNkZDRhYTM4ZjFkYmVkNWRjOTU5NTc0EgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Manage Ingredients', filename: 'ManageIngredients', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzVmOTRlNzQ4NDBiZjQ5MWRiZTNjYmQxMDhlNTM2NDJkEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Discover & Recommend', filename: 'DiscoverRecommend', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzA2N2EwMWU5MmE5ODQ3ZmI4ZjhjZGU5OTU5NzJkODAyEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'User Registration', filename: 'UserRegistration', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzJiMzA0ZmMxOWNlMjQwMDhhN2E3MTE1YjY4YjAwODdjEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Recipe Detail', filename: 'RecipeDetailText', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzdkZTQ3YWQ0OTk2MjRjYjk4ZDY1ODA2OTJkMjRjNGUyEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Search Cookbook', filename: 'SearchCookbook', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QyYWU1ZTM1MjcwYzRlNDViYzJhMzQ2MjVhZTMwMmYxEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Admin Login', filename: 'AdminLogin', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzkwNzU5ZmI3MDQzZjQyM2Q5YzM2OGM2NTg1YTk1ZTlkEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Manage Recipes', filename: 'ManageRecipes', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2JmNmM1ZGY5OGU4ODQ4NTJiY2Y2YjBiYzViZWUxNmI0EgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' },
    { title: 'Admin Dashboard', filename: 'AdminDashboard', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2FjMjE5NTI3MTA5YjRkNDdhMTYxZTEwMDc5NzRlYzAxEgsSBxDAvvqtpxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDMwNDY4MzkyOTMzMTI4ODY2Ng&filename=&opi=89354086' }
];

async function run() {
    const pagesDir = path.resolve('../frontend/src/stitch_pages');
    await fs.mkdir(pagesDir, { recursive: true });

    let routesCode = [];
    let importsCode = [];

    for (const screen of screens) {
        console.log(`Processing ${screen.filename}...`);
        try {
            const res = await fetch(screen.url);
            const text = await res.text();

            // Extract body content
            let bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            let bodyContent = bodyMatch ? bodyMatch[1] : text;

            // HTML to JSX conversions
            let jsx = bodyContent
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // remove HTML style blocks
                .replace(/class=/g, 'className=')
                .replace(/for=/g, 'htmlFor=')
                .replace(/<!--[\s\S]*?-->/g, '') // remove HTML comments
                .replace(/<img(.*?)>/g, (match, inner) => {
                    if (inner.endsWith('/')) return match;
                    return `<img${inner} />`;
                })
                .replace(/<input(.*?)>/g, (match, inner) => {
                    if (inner.endsWith('/')) return match;
                    return `<input${inner} />`;
                })
                .replace(/<hr(.*?)>/gi, (match, inner) => {
                    if (inner.endsWith('/')) return match;
                    return `<hr${inner} />`;
                })
                .replace(/<br(.*?)>/gi, (match, inner) => {
                    if (inner.endsWith('/')) return match;
                    return `<br${inner} />`;
                })
                .replace(/style="[^"]*"/g, ''); // React styles must be objects. Strip them as Tailwind covers 99%.

            const componentName = screen.filename;
            const fileContent = `import React from 'react';

export default function ${componentName}() {
  return (
    <>
      ${jsx}
    </>
  );
}
`;
            await fs.writeFile(path.join(pagesDir, `${componentName}.jsx`), fileContent);
            console.log(`Saved ${componentName}.jsx`);

            importsCode.push(`import ${componentName} from './stitch_pages/${componentName}';`);
            routesCode.push(`          <Route path="/${componentName.toLowerCase()}" element={<${componentName} />} />`);

        } catch (e) {
            console.error(`Failed to process ${screen.filename}:`, e);
        }
    }

    console.log('\\n// Copy these into App.jsx: \\n');
    console.log(importsCode.join('\\n'));
    console.log('\\n' + routesCode.join('\\n'));
}

run();
