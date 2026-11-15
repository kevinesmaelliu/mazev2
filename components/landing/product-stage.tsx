"use client"

import { Badge } from "@astryxdesign/core/Badge"
import { Button } from "@astryxdesign/core/Button"
import { Divider } from "@astryxdesign/core/Divider"
import { EmptyState } from "@astryxdesign/core/EmptyState"
import { List, ListItem } from "@astryxdesign/core/List"
import { Section } from "@astryxdesign/core/Section"
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Icon } from "@astryxdesign/core/Icon"
import {
  ClipboardDocumentListIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline"

export type LandingChapter = "create" | "trade" | "results"

const CHAPTER_COPY: Record<
  LandingChapter,
  { title: string; detail: string }
> = {
  create: {
    title: "Build a test in one sitting",
    detail:
      "Upload a screen, add tasks, publish. Reviews wait until you spend credits.",
  },
  trade: {
    title: "Take 2. Unlock 1.",
    detail:
      "Each completed peer test earns a credit. Two credits buys one review round.",
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
    <Section padding={5} variant="section" width="100%">
      <VStack gap={4}>
        <HStack gap={3} vAlign="center">
          <Text type="label" weight="semibold">
            Luma
          </Text>
          <StackItem size="fill">
            <Text type="supporting" color="secondary">
              Checkout redesign · draft
            </Text>
          </StackItem>
          <Badge
            label={chapter === "results" ? "2 credits spent" : "0 reviews yet"}
            variant={chapter === "results" ? "success" : "neutral"}
          />
        </HStack>

        <Divider />

        <VStack gap={3}>
          <Heading level={3} type="display-3">
            {copy.title}
          </Heading>
          <Text type="body" color="secondary">
            {copy.detail}
          </Text>
          {chapter === "create" && <CreatePanel />}
          {chapter === "trade" && <TradePanel />}
          {chapter === "results" && <ResultsPanel />}
        </VStack>
      </VStack>
    </Section>
  )
}

function CreatePanel() {
  return (
    <VStack gap={4}>
      <List hasDividers density="compact">
        <ListItem
          label="First click: Find checkout"
          description="Where do people tap to pay?"
          startContent={<Icon icon={PencilSquareIcon} size="sm" />}
        />
        <ListItem
          label="Task: Complete purchase"
          description="Can they finish without help?"
          startContent={<Icon icon={ClipboardDocumentListIcon} size="sm" />}
        />
        <ListItem
          label="Preference: A or B confirmation"
          description="Which receipt screen feels clearer?"
          startContent={<Icon icon={MagnifyingGlassIcon} size="sm" />}
        />
      </List>
      <HStack gap={3} vAlign="center">
        <Button label="Publish test" variant="primary" size="sm" />
        <Text type="supporting" color="secondary">
          Live now · waiting on credits for reviews
        </Text>
      </HStack>
    </VStack>
  )
}

function TradePanel() {
  return (
    <VStack gap={4}>
      <HStack gap={8}>
        <VStack gap={1}>
          <Text type="display-2" weight="bold">
            0
          </Text>
          <Text type="supporting" color="secondary">
            credits
          </Text>
        </VStack>
        <VStack gap={1}>
          <Text type="display-2" weight="bold">
            2
          </Text>
          <Text type="supporting" color="secondary">
            tests to take
          </Text>
        </VStack>
        <VStack gap={1}>
          <Text type="display-2" weight="bold">
            1
          </Text>
          <Text type="supporting" color="secondary">
            review unlocked
          </Text>
        </VStack>
      </HStack>
      <List hasDividers density="compact">
        <ListItem
          label="Nav study · Maya · RISD"
          description="+1 credit when finished"
        />
        <ListItem
          label="Onboarding flow · Jordan · SCAD"
          description="+1 credit when finished"
        />
      </List>
      <EmptyState
        isCompact
        headingLevel={4}
        icon={<Icon icon={LockClosedIcon} />}
        title="Your test is live, reviews are locked"
        description="Finish two peer tests, spend the credits, then responses start coming in."
      />
    </VStack>
  )
}

function ResultsPanel() {
  return (
    <VStack gap={3}>
      <List hasDividers density="compact">
        <ListItem
          label="11 of 14 missed the pay button"
          description="Move checkout into the primary sticky bar."
        />
        <ListItem
          label="Median task time 2m 40s"
          description="Cut the address step before card entry."
        />
        <ListItem
          label="Preference lean: B confirmation"
          description="9 preferred the quieter receipt layout."
        />
      </List>
      <Text type="supporting" color="secondary">
        Next design change is ready to ship back into Figma.
      </Text>
    </VStack>
  )
}
