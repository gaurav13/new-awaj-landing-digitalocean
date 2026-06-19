"use server"

/**
 * Media coverage has been merged into the unified Newsroom (`news_articles`).
 * These functions remain as thin compatibility wrappers so existing components
 * (homepage "AWAJ in the Media" carousel, program detail pages) keep working.
 * Manage all coverage from the Newsroom tab in the admin dashboard.
 */

import { getFeaturedCoverage, getCoverageByProgram } from "@/app/actions/news"

export async function getFeaturedMedia(limit = 4) {
  return getFeaturedCoverage(limit)
}

export async function getMediaByProgram(programId: number) {
  return getCoverageByProgram(programId)
}

export async function getAllMedia() {
  return getFeaturedCoverage(100)
}
