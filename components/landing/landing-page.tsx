"use client"

import { useEffect, useState, type CSSProperties } from "react"
import Link from "next/link"
import { AppShell } from "@astryxdesign/core/AppShell"
import { Button } from "@astryxdesign/core/Button"
import { Grid } from "@astryxdesign/core/Grid"
import { Icon } from "@astryxdesign/core/Icon"
import {
  Layout,
  LayoutContent,
  LayoutFooter,
} from "@astryxdesign/core/Layout"
import { Section } from "@astryxdesign/core/Section"
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack"
import { Heading, Text } from "@astryxdesign/core/Text"
import { TopNav } from "@astryxdesign/core/TopNav"
import { Link as AstryxLink } from "@astryxdesign/core/Link"
import { ArrowRightIcon } from "@heroicons/react/20/solid"
import {
  ProductStage,
  type LandingChapter,
} from "@/components/landing/product-stage"

const CHAPTERS: Array<{
  id: LandingChapter
  heading: string
  body: string
}> = [
  {
    id: "create",
    heading: "Create the test today",
    body: "Upload a screen, write tasks, and publish. Luma does not wait on a participant budget to let you build.",
  },
  {
    id: "trade",
    heading: "Trade tests for reviews",
    body: "Complete two peer tests to earn two credits. Spend them to unlock reviews on yours.",
  },
  {
    id: "results",
    heading: "Turn answers into changes",
    body: "See where people clicked, what they said, and what to fix next in the design.",
  },
]

const stickyStage: CSSProperties = {
  position: "sticky",
  top: 88,
}

const screenSection: CSSProperties = {
  minHeight: "100svh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}

export function LandingPage() {
  const [chapter, setChapter] = useState<LandingChapter>("create")

  useEffect(() => {
    const nodes = CHAPTERS.map((item) =>
      document.getElementById(item.id)
    ).filter((node): node is HTMLElement => Boolean(node))
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const next = visible?.target.id as LandingChapter | undefined
        if (next) setChapter(next)
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0.2, 0.5, 0.8] }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <AppShell
      height="auto"
      variant="wash"
      contentPadding={0}
      topNav={
        <TopNav
          label="Luma"
          heading={
            <AstryxLink
              href="/"
              as={Link}
              type="large"
              weight="bold"
              color="primary"
            >
              Luma
            </AstryxLink>
          }
          endContent={
            <HStack gap={2} vAlign="center">
              <Button label="Log in" variant="ghost" href="/login" as={Link} />
              <Button
                label="Start your first test"
                variant="primary"
                href="/login"
                as={Link}
              />
            </HStack>
          }
        />
      }
    >
      <Layout
        height="auto"
        contentWidth={1120}
        padding={0}
        content={
          <LayoutContent padding={0}>
            <VStack gap={0}>
              <Section padding={6} variant="transparent" style={screenSection}>
                <VStack gap={8} hAlign="center">
                  <VStack gap={4} hAlign="center" maxWidth={780}>
                    <Text
                      type="display-1"
                      weight="bold"
                      justify="center"
                      textWrap="balance"
                    >
                      Luma
                    </Text>
                    <Heading
                      level={1}
                      type="display-2"
                      justify="center"
                      textWrap="balance"
                    >
                      UX research for design students
                    </Heading>
                    <Text
                      type="large"
                      color="secondary"
                      justify="center"
                      textWrap="balance"
                    >
                      Create tests now. Take two peer tests, spend the credits,
                      and get your study reviewed.
                    </Text>
                    <Text type="body" weight="semibold" justify="center">
                      Complete 2 tests. Get 1 review.
                    </Text>
                  </VStack>
                  <HStack gap={3}>
                    <Button
                      label="Start your first test"
                      variant="primary"
                      href="/login"
                      as={Link}
                      endContent={
                        <Icon
                          icon={ArrowRightIcon}
                          size="sm"
                          color="inherit"
                        />
                      }
                    />
                    <Button
                      label="See how credits work"
                      variant="secondary"
                      href="#trade"
                      as={Link}
                    />
                  </HStack>
                  <ProductStage chapter="create" />
                </VStack>
              </Section>

              <Section padding={6} variant="muted">
                <Grid
                  gap={8}
                  columns={{ minWidth: 320, repeat: "fit" }}
                  align="start"
                >
                  <VStack gap={0}>
                    {CHAPTERS.map((item) => (
                      <VStack
                        key={item.id}
                        id={item.id}
                        gap={3}
                        style={screenSection}
                        maxWidth={480}
                      >
                        <Heading level={2} type="display-3" textWrap="balance">
                          {item.heading}
                        </Heading>
                        <Text type="large" color="secondary" textWrap="pretty">
                          {item.body}
                        </Text>
                      </VStack>
                    ))}
                  </VStack>
                  <StackItem style={stickyStage}>
                    <ProductStage chapter={chapter} />
                  </StackItem>
                </Grid>
              </Section>

              <Section padding={6} variant="transparent" style={screenSection}>
                <VStack gap={5} hAlign="center" maxWidth={640}>
                  <Heading
                    level={2}
                    type="display-2"
                    justify="center"
                    textWrap="balance"
                  >
                    Ready when your class project is
                  </Heading>
                  <Text
                    type="large"
                    color="secondary"
                    justify="center"
                    textWrap="balance"
                  >
                    Build the study today. Earn reviews by helping classmates
                    with theirs.
                  </Text>
                  <Button
                    label="Start your first test"
                    variant="primary"
                    href="/login"
                    as={Link}
                    endContent={
                      <Icon icon={ArrowRightIcon} size="sm" color="inherit" />
                    }
                  />
                </VStack>
              </Section>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={4} vAlign="center">
              <Text type="label" weight="semibold">
                Luma
              </Text>
              <StackItem size="fill">
                <Text type="supporting" color="secondary">
                  Peer UX research for design students
                </Text>
              </StackItem>
              <AstryxLink href="/login" as={Link} type="supporting">
                Log in
              </AstryxLink>
            </HStack>
          </LayoutFooter>
        }
      />
    </AppShell>
  )
}
