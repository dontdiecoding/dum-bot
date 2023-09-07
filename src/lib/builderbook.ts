import axios from "axios";

const postDataUrl = (blockId: string) =>
    `https://book.buildergroop.com/api/getBlock?blockId=${blockId}`;

const allPostsUrl = `https://book.buildergroop.com/_next/data/EsNx_8HJROL4tdzIvefz9/index.json`;

export const getAllContents = async () => {
    const req = await await axios
        .get(allPostsUrl)
        .then((d) => d.data.pageProps.categories)
        .catch((r) => null);
    const categories = Object.keys(req) as string[];
    const datas: Record<string, string[]> = {};
    await categories.forEach(async (category) => {
        const pages = req[category].pages;
        const pagesKeys = Object.keys(pages);
        pagesKeys.forEach(async (page) => {
            const blockId = pages[page].blockId;

            const req = await axios
                .get(postDataUrl(blockId))
                .then((d) => d.data)
                .catch((r) => null);
            const text: string[] = [];
            req.children.forEach(async (children: any) => {
                children.paragraph?.rich_text?.forEach((rt: any) =>
                    text.push(rt.plain_text)
                );
            });
            datas[blockId as string] = text;
        });
    });

    console.log(datas);
};
