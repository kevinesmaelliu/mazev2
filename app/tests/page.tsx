"use client"

import Link from "next/link"
import { AppShell } from "@astryxdesign/core/AppShell"
import { Button } from "@astryxdesign/core/Button"
import { EmptyState } from "@astryxdesign/core/EmptyState"
import { Icon } from "@astryxdesign/core/Icon"
import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout"
import { List, ListItem } from "@astryxdesign/core/List"
import { Section } from "@astryxdesign/core/Section"
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack"
import { Heading, Text } from "@astryxdesign/core/Text"
import { TopNav } from "@astryxdesign/core/TopNav"
import { Link as AstryxLink } from "@astryxdesign/core/Link"
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline"

const OPEN_TESTS = [
  {
    title: "Nav study · checkout entry",
    detail: "Maya · RISD · ~4 min · +1 credit",
  },
  {
    title: "Onboarding preference A/B",
    detail: "Jordan · SCAD · ~6 min · +1 credit",
  },
  {
    title: "First-click: find pricing",
    detail: "Sam · local cohort · ~3 min · +1 credit",
  },
]

export default function TestsPage() {
  return (
    <AppShell
      height="auto"
      variant="wash"
      contentPadding={0}
      topNav={
        <TopNav
          label="Luma"
          heading={
            <AstryxLink href="/" as={Link} type="large" weight="bold" color="primary">
              Luma
            </AstryxLink>
          }
          endContent={
            <HStack gap={2}>
              <Button label="Create a test" variant="secondary" href="/create" as={Link} />
              <Button label="Open canvas" variant="primary" href="/create" as={Link} />
            </HStack>
          }
        />
      }
    >
      <Layout
        height="auto"
        contentWidth={720}
        padding={5}
        header={
          <LayoutHeader hasDivider={false}>
            <VStack gap={2}>
              <Heading level={1} type="display-3">
                Open tests
              </Heading>
              <Text type="body" color="secondary">
                Finish two to earn the credits that unlock reviews on your own
                study.
              </Text>
            </VStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <Section padding={0} variant="transparent">
              {OPEN_TESTS.length === 0 ? (
                <EmptyState
                  title="No open tests yet"
                  description="Create yours first, then come back when classmates publish."
                  icon={<Icon icon={ClipboardDocumentListIcon} />}
                  actions={
                    <Button
                      label="Start your first test"
                      variant="primary"
                      href="/create"
                      as={Link}
                    />
                  }
                />
              ) : (
                <VStack gap={4}>
                  <List hasDividers>
                    {OPEN_TESTS.map((test) => (
                      <ListItem
                        key={test.title}
                        label={test.title}
                        description={test.detail}
                        endContent={
                          <Button label="Take test" variant="secondary" size="sm" />
                        }
                      />
                    ))}
                  </List>
                  <HStack>
                    <StackItem size="fill" />
                    <Text type="supporting" color="secondary">
                      Stub list for MVP routing · responses not wired yet
                    </Text>
                  </HStack>
                </VStack>
              )}
            </Section>
          </LayoutContent>
        }
      />
    </AppShell>
  )
}
