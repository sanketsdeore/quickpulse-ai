export interface Article {
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    publishedAt: string;
    source: {
        name: string;
        url: string;
    };
}

const API_KEY = '80e13f03e6220d3fef552a3f9f078bf3';
const BASE_URL = `https://gnews.io/api/v4`;

export const fetchNews = async (query = ''): Promise<Article[]> => {
    try {
        const url = query
          ? `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=en&apikey=${API_KEY}`
          : `${BASE_URL}/top-headlines?country=in&lang=en&max=10&apikey=${API_KEY}&t=${Date.now()}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("API returned:", data.totalArticles, "articles");
        return data.articles;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};