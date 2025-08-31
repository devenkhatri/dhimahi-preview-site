import { getAllPosts, getAllCategories, getTagsWithCounts } from "@/lib/markdown";
import InsightsPageClient from './InsightsPageClient';

export default function InsightsPage() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const tagsWithCounts = getTagsWithCounts();

  return (
    <InsightsPageClient 
      allPosts={allPosts}
      categories={categories}
      tagsWithCounts={tagsWithCounts}
    />
  );
}