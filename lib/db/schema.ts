import { pgTable, text, timestamp, boolean, serial, integer, date, jsonb } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").$defaultFn(() => new Date()),
  updatedAt: timestamp("updatedAt").$defaultFn(() => new Date()),
})

export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("News"),
  imageUrl: text("image_url"),
  location: text("location"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  eventDate: date("event_date").notNull(),
  timeLabel: text("time_label"),
  location: text("location"),
  imageUrl: text("image_url"),
  bannerUrl: text("banner_url"),
  sponsors: jsonb("sponsors").$type<EventSponsor[]>().notNull().default([]),
  speakers: jsonb("speakers").$type<EventSpeaker[]>().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type EventSponsor = { name: string; logoUrl?: string; linkUrl?: string }
export type EventSpeaker = { name: string; role?: string; company?: string; imageUrl?: string; linkUrl?: string }

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  icon: text("icon").notNull().default("Rocket"),
  regions: text("regions"),
  imageUrl: text("image_url"),
  bannerUrl: text("banner_url"),
  partners: jsonb("partners").$type<ProgramPartner[]>().notNull().default([]),
  startups: jsonb("startups").$type<ProgramStartup[]>().notNull().default([]),
  gallery: jsonb("gallery").$type<GalleryItem[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type ProgramPartner = { name: string; logoUrl?: string; linkUrl?: string }
export type ProgramStartup = { name: string; logoUrl?: string; description?: string; linkUrl?: string }
export type GalleryItem = { imageUrl: string; caption?: string }

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull().default("Article"),
  url: text("url"),
  thumbnailUrl: text("thumbnail_url"),
  source: text("source"),
  excerpt: text("excerpt"),
  programId: integer("program_id").references(() => programs.id, { onDelete: "set null" }),
  isFeatured: boolean("is_featured").notNull().default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  sortOrder: integer("sort_order").notNull().default(0),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company"),
  bio: text("bio"),
  imageUrl: text("image_url"),
  linkedinUrl: text("linkedin_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tier: text("tier").notNull().default("strategic"),
  logoUrl: text("logo_url"),
  linkUrl: text("link_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization"),
  inquiryType: text("inquiry_type").notNull().default("Other"),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
