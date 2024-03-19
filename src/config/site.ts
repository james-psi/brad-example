export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "BRAD Example Table",
  description:
    "Shadcn table component with server side sorting, pagination, and filtering",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://table.sadmn.com",
}
