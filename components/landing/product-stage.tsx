"use client"

import {
  Edit,
  Locked,
  Search,
  Receipt,
  Icon,
} from "@/components/lime/icon"
import { Badge } from "@/components/lime/ui/badge"
import { Button } from "@/components/lime/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/lime/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "@/components/lime/ui/empty"
import { List, ListIcon, ListItem } from "@/components/lime/ui/list"
import { Separator } from "@/components/lime/ui/separator"

export type LandingChapter = "create" | "trade" | "results"

const CHAPTER_COPY: Record<
  LandingChapter,
  { title: string; detail: string }
> = {
  create: {
    title: "Build a test in one sitting",
    detail:
      "Upload a screen, add tasks, then publish. Reviews wait until you spend credits.",
  },
  trade: {
    title: "Take 2. Unlock 1.",
    detail:
      "Finish two peer tests to earn two credits. Spend them to unlock one review round.",
  },
  results: {
    title: "Read what to change next",
    detail:
      "Clicks, answers, and notes land in one place so the next design move is clear.",
  },
}

export function ProductStage({ chapter }: { chapter: LandingChapter }) {
  const copy = CHAPTER_COPY[chapter]

  return (
    <Card variant="outline" className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Checkout redesign</CardTitle>
          <Badge variant={chapter === "results" ? "success" : "neutral"}>
            {chapter === "results" ? "2 credits spent" : "0 reviews yet"}
          </Badge>
        </div>
        <CardDescription>Draft · Luma studio project</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4 pt-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-fg">{copy.title}</h3>
          <p className="text-sm text-fg-2">{copy.detail}</p>
        </div>
        {chapter === "create" && <CreatePanel />}
        {chapter === "trade" && <TradePanel />}
        {chapter === "results" && <ResultsPanel />}
      </CardContent>
      {chapter === "create" && (
        <CardFooter className="flex flex-wrap items-center gap-3">
          <Button variant="solid" size="sm">
            Publish test
          </Button>
          <p className="text-sm text-fg-2">
            Live now. Waiting on credits for reviews.
          </p>
        </CardFooter>
      )}
    </Card>
  )
}

function CreatePanel() {
  return (
    <List className="-mx-1">
      <ListItem
        leading={<ListIcon icon={Edit} />}
        title="First click: Find checkout"
        description="Where do people tap to pay?"
      />
      <ListItem
        leading={<ListIcon icon={Receipt} />}
        title="Task: Complete purchase"
        description="Can they finish without help?"
      />
      <ListItem
        leading={<ListIcon icon={Search} />}
        title="Preference: A or B confirmation"
        description="Which receipt screen feels clearer?"
      />
    </List>
  )
}

function TradePanel() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-fg">
        Finish 2 peer tests to unlock 1 review round on this draft.
      </p>
      <List className="-mx-1">
        <ListItem
          title="Nav study · Maya · RISD"
          description="+1 credit when finished"
        />
        <ListItem
          title="Onboarding flow · Jordan · SCAD"
          description="+1 credit when finished"
        />
      </List>
      <Empty className="px-0 py-6">
        <EmptyIcon>
          <Icon icon={Locked} size={24} />
        </EmptyIcon>
        <EmptyTitle>Reviews are locked</EmptyTitle>
        <EmptyDescription>
          Your test is live. Finish two peer tests, spend the credits, then
          responses start coming in.
        </EmptyDescription>
      </Empty>
    </div>
  )
}

function ResultsPanel() {
  return (
    <div className="flex flex-col gap-3">
      <List className="-mx-1">
        <ListItem
          title="11 of 14 missed the pay button"
          description="Move checkout into the primary sticky bar."
        />
        <ListItem
          title="Median task time 2m 40s"
          description="Cut the address step before card entry."
        />
        <ListItem
          title="Preference lean: B confirmation"
          description="9 preferred the quieter receipt layout."
        />
      </List>
      <p className="text-sm text-fg-2">
        Next design change is ready to take back into Figma.
      </p>
    </div>
  )
}
