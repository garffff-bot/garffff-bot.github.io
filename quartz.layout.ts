import { PageLayout, SharedLayout } from "./quartz/cfg";
import * as Component from "./quartz/components";

// Shared components across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      // GitHub: "https://github.com/jackyzha0/quartz",
      // "Discord Community": "https://discord.gg/UzQuaZfa",
      // "Can't see on mobile devices?": "Use a PC!",
    },
  }),
};

// Layout for pages displaying a single page (e.g., a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    // Include Darkmode component with initial state 'dark'
    Component.Darkmode({ initialState: 'dark' }), 
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    // Component.Backlinks(),
  ],
};

// Layout for pages displaying lists of pages (e.g., tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    // Include Darkmode component with initial state 'dark'
    Component.Darkmode({ initialState: 'dark' }), 
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
};