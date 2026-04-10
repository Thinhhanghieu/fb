import { FeedList } from '@/components/FeedList';
import { CreatePost } from '@/components/shared/CreatePost';
import { StoryBar } from '@/components/shared/StoryBar';
import { LeftSidebar, RightSidebar } from '@/components/shared/Sidebars';

export default function FeedPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 flex gap-6">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Feed */}
      <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-4">
        {/* Stories */}
        <section>
          <StoryBar />
        </section>

        {/* Create Post */}
        <CreatePost />

        {/* Posts */}
        <FeedList />
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
