"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { updateMembershipContent } from "@/app/actions/membership-content"
import {
  DEFAULT_COMPARISON,
  type MembershipContent,
  type ComparisonRow,
  type MembershipInfoBlock,
} from "@/lib/membership-content"

const ICON_OPTIONS = [
  "CircleDollarSign",
  "BadgeCheck",
  "HeartHandshake",
  "ShieldCheck",
  "Calendar",
  "CreditCard",
  "Users",
  "Handshake",
  "Globe",
  "Award",
  "Star",
  "Rocket",
  "Building2",
  "Crown",
]

type PlanColumn = { id: number; name: string }

const selectClass =
  "h-9 rounded-lg border border-navy/15 bg-white px-2 text-sm text-navy-text focus:outline-none focus:ring-2 focus:ring-gold/40"

function cellMode(value: string): "yes" | "no" | "custom" {
  if (value === "yes") return "yes"
  if (value === "no" || value === "" || value === "-" || value === "—") return "no"
  return "custom"
}

export function MembershipContentPanel({
  content,
  plans,
}: {
  content: MembershipContent
  plans: PlanColumn[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [comparison, setComparison] = useState<ComparisonRow[]>(content.comparison)
  const [infoBlocks, setInfoBlocks] = useState<MembershipInfoBlock[]>(content.infoBlocks)
  const [cta, setCta] = useState(content.cta)

  const colCount = plans.length

  function normalizeValues(values: string[]): string[] {
    const next = [...values]
    while (next.length < colCount) next.push("no")
    return next.slice(0, colCount)
  }

  function save() {
    setSaved(false)
    const payload: MembershipContent = {
      comparison: comparison
        .filter((r) => r.label.trim())
        .map((r) => ({ label: r.label.trim(), values: normalizeValues(r.values) })),
      infoBlocks: infoBlocks.filter((b) => b.title.trim()),
      cta,
    }
    startTransition(async () => {
      await updateMembershipContent(payload)
      setSaved(true)
      router.refresh()
    })
  }

  // ---- Comparison handlers ----
  function setRowLabel(i: number, label: string) {
    setComparison((rows) => rows.map((r, idx) => (idx === i ? { ...r, label } : r)))
  }
  function setCell(rowIdx: number, colIdx: number, value: string) {
    setComparison((rows) =>
      rows.map((r, idx) => {
        if (idx !== rowIdx) return r
        const values = normalizeValues(r.values)
        values[colIdx] = value
        return { ...r, values }
      }),
    )
  }
  function addRow() {
    setComparison((rows) => [...rows, { label: "", values: plans.map(() => "no") }])
  }
  function removeRow(i: number) {
    setComparison((rows) => rows.filter((_, idx) => idx !== i))
  }
  function resetComparison() {
    setComparison(DEFAULT_COMPARISON.map((r) => ({ ...r, values: normalizeValues(r.values) })))
  }

  // ---- Info block handlers ----
  function setBlock(i: number, patch: Partial<MembershipInfoBlock>) {
    setInfoBlocks((blocks) => blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)))
  }
  function addBlock() {
    setInfoBlocks((blocks) => [
      ...blocks,
      { icon: "Star", title: "", desc: "", chipIcon: "BadgeCheck", chipText: "" },
    ])
  }
  function removeBlock(i: number) {
    setInfoBlocks((blocks) => blocks.filter((_, idx) => idx !== i))
  }

  return (
    <div className="mt-8 border-t border-navy/10 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy-text">Membership page content</h2>
          <p className="mt-1 text-sm text-navy-text/60">
            Edit the benefits comparison table, the value highlights, and the call-to-action banner shown on the public
            Membership page.
          </p>
        </div>
        <Button onClick={save} disabled={isPending} className="rounded-full bg-navy text-white hover:bg-navy/90">
          {isPending ? "Saving..." : "Save content"}
        </Button>
      </div>

      {/* Comparison editor */}
      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Benefits comparison</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetComparison}
              className="h-8 rounded-full border-navy/20 text-xs"
            >
              Reset to defaults
            </Button>
            <Button type="button" onClick={addRow} className="h-8 rounded-full bg-gold text-xs text-navy hover:opacity-90">
              <Plus className="mr-1 h-3.5 w-3.5" /> Add row
            </Button>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-navy-text/55">
          Each row is one benefit. For each plan choose <strong>Yes</strong> (colored check), <strong>No</strong>{" "}
          (dash), or <strong>Custom</strong> to enter text such as “Paid (when needed)”.
        </p>

        {colCount === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-navy/20 p-4 text-sm text-navy-text/60">
            Add at least one membership plan above to configure the comparison table.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {comparison.map((row, rowIdx) => (
              <div key={rowIdx} className="rounded-xl border border-navy/10 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={row.label}
                    placeholder="Benefit name"
                    onChange={(e) => setRowLabel(rowIdx, e.target.value)}
                    className="font-medium"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeRow(rowIdx)}
                    className="h-9 w-9 shrink-0 p-0 text-navy-text/40 hover:text-awaj-red"
                    aria-label="Remove row"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {plans.map((plan, colIdx) => {
                    const value = normalizeValues(row.values)[colIdx]
                    const mode = cellMode(value)
                    return (
                      <div key={plan.id} className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-navy-text/60">
                          {plan.name.replace(/\s*Member$/i, "")}
                        </span>
                        <select
                          className={selectClass}
                          value={mode}
                          onChange={(e) => {
                            const m = e.target.value
                            setCell(rowIdx, colIdx, m === "custom" ? "Paid (when needed)" : m)
                          }}
                        >
                          <option value="yes">Yes (check)</option>
                          <option value="no">No (dash)</option>
                          <option value="custom">Custom text…</option>
                        </select>
                        {mode === "custom" ? (
                          <Input
                            value={value}
                            placeholder="Paid (when needed)"
                            onChange={(e) => setCell(rowIdx, colIdx, e.target.value)}
                            className="h-8 text-xs"
                          />
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info blocks editor */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Value highlights</h3>
          <Button type="button" onClick={addBlock} className="h-8 rounded-full bg-gold text-xs text-navy hover:opacity-90">
            <Plus className="mr-1 h-3.5 w-3.5" /> Add highlight
          </Button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-navy-text/55">
          The four cards shown below the comparison table, each with an icon, title, description, and a small badge
          chip.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {infoBlocks.map((block, i) => (
            <div key={i} className="rounded-xl border border-navy/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-navy-text/50">
                  Highlight {i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeBlock(i)}
                  className="h-8 w-8 p-0 text-navy-text/40 hover:text-awaj-red"
                  aria-label="Remove highlight"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Icon</Label>
                    <select
                      className={selectClass}
                      value={block.icon}
                      onChange={(e) => setBlock(i, { icon: e.target.value })}
                    >
                      {ICON_OPTIONS.map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Chip icon</Label>
                    <select
                      className={selectClass}
                      value={block.chipIcon}
                      onChange={(e) => setBlock(i, { chipIcon: e.target.value })}
                    >
                      {ICON_OPTIONS.map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={block.title}
                    placeholder="Pay When You Need"
                    onChange={(e) => setBlock(i, { title: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    rows={3}
                    value={block.desc}
                    placeholder="Describe this benefit..."
                    onChange={(e) => setBlock(i, { desc: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Chip text</Label>
                  <Input
                    value={block.chipText}
                    placeholder="No hidden fees. Pay only for value."
                    onChange={(e) => setBlock(i, { chipText: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA editor */}
      <section className="mt-10">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Call-to-action banner</h3>
        <p className="mt-2 text-xs leading-relaxed text-navy-text/55">
          The closing banner at the bottom of the Membership page.
        </p>
        <div className="mt-4 grid gap-4 rounded-xl border border-navy/10 bg-white p-5 lg:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Title</Label>
            <Input value={cta.title} onChange={(e) => setCta({ ...cta, title: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Subtitle</Label>
            <Input value={cta.subtitle} onChange={(e) => setCta({ ...cta, subtitle: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Primary button label</Label>
            <Input value={cta.primaryLabel} onChange={(e) => setCta({ ...cta, primaryLabel: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Primary button link</Label>
            <Input
              value={cta.primaryUrl}
              placeholder="/contact"
              onChange={(e) => setCta({ ...cta, primaryUrl: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Secondary link label</Label>
            <Input value={cta.secondaryLabel} onChange={(e) => setCta({ ...cta, secondaryLabel: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Secondary link URL</Label>
            <Input
              value={cta.secondaryUrl}
              placeholder="/contact"
              onChange={(e) => setCta({ ...cta, secondaryUrl: e.target.value })}
            />
          </div>
        </div>
      </section>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={save} disabled={isPending} className="rounded-full bg-navy text-white hover:bg-navy/90">
          {isPending ? "Saving..." : "Save content"}
        </Button>
        {saved && (
          <p className="text-sm font-medium text-gold" role="status">
            Membership content saved.
          </p>
        )}
      </div>
    </div>
  )
}
