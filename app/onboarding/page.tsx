"use client"

import { useMemo, useState, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@astryxdesign/core/Button"
import { FormLayout } from "@astryxdesign/core/FormLayout"
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
} from "@astryxdesign/core/Layout"
import { RadioList, RadioListItem } from "@astryxdesign/core/RadioList"
import { Section } from "@astryxdesign/core/Section"
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack"
import { Step, Stepper } from "@astryxdesign/core/Stepper"
import { Heading, Text } from "@astryxdesign/core/Text"
import { TextInput } from "@astryxdesign/core/TextInput"
import { useMediaQuery } from "@astryxdesign/core/hooks"
import { EmptyState } from "@astryxdesign/core/EmptyState"
import { Icon } from "@astryxdesign/core/Icon"
import { List, ListItem } from "@astryxdesign/core/List"
import {
  AcademicCapIcon,
  LockClosedIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"

const STEPS = [
  { label: "You" },
  { label: "Credits" },
  { label: "Start" },
]

const footerZone: CSSProperties = { flexBasis: 0 }

type FirstMove = "create" | "take"

export default function OnboardingPage() {
  const router = useRouter()
  const isNarrow = useMediaQuery("(max-width: 640px)")
  const [step, setStep] = useState(0)
  const [attempted, setAttempted] = useState<Set<number>>(new Set())
  const [name, setName] = useState("")
  const [school, setSchool] = useState("")
  const [firstMove, setFirstMove] = useState<FirstMove>("create")

  const errors = useMemo(() => {
    return {
      name: name.trim().length < 2 ? "Add the name classmates will see." : null,
      firstMove: !firstMove ? "Pick how you want to begin." : null,
    }
  }, [name, firstMove])

  const stepHasError = (index: number) => {
    if (!attempted.has(index)) return false
    if (index === 0) return Boolean(errors.name)
    if (index === 2) return Boolean(errors.firstMove)
    return false
  }

  const canLeaveStep = (index: number) => {
    if (index === 0) return !errors.name
    if (index === 2) return !errors.firstMove
    return true
  }

  const goNext = () => {
    setAttempted((prev) => new Set(prev).add(step))
    if (!canLeaveStep(step)) return
    if (step >= STEPS.length - 1) {
      router.push(firstMove === "create" ? "/create" : "/tests")
      return
    }
    setStep((current) => current + 1)
  }

  const goBack = () => {
    if (step === 0) {
      router.push("/")
      return
    }
    setStep((current) => current - 1)
  }

  return (
    <Layout
      height="fill"
      contentWidth={640}
      padding={5}
      header={
        <LayoutHeader hasDivider={false}>
          <VStack gap={isNarrow ? 3 : 5}>
            <HStack gap={3} vAlign="center">
              <StackItem size="fill">
                <Text type="label" weight="semibold">
                  Luma
                </Text>
              </StackItem>
              <Button label="Exit" variant="ghost" href="/" as={Link} />
            </HStack>
            <Stepper
              activeStep={step}
              density="balanced"
              onStepClick={setStep}
              label="Onboarding"
              horizontalOptions={{
                minimumStepWidth: 112,
                collapsedVariant: "withLabel",
              }}
            >
              {STEPS.map((item, index) => (
                <Step
                  key={item.label}
                  step={index}
                  label={item.label}
                  status={stepHasError(index) ? "error" : undefined}
                />
              ))}
            </Stepper>
          </VStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent>
          {step === 0 && (
            <VStack gap={5}>
              <VStack gap={1}>
                <Heading level={1} type="display-3">
                  Who is researching?
                </Heading>
                <Text type="body" color="secondary">
                  Luma is built for UXD students who need real participants for
                  class and portfolio work.
                </Text>
              </VStack>
              <FormLayout>
                <TextInput
                  label="Display name"
                  value={name}
                  onChange={setName}
                  placeholder="Alex Rivera"
                  status={
                    attempted.has(0) && errors.name
                      ? { type: "error", message: errors.name }
                      : undefined
                  }
                />
                <TextInput
                  label="School or program"
                  value={school}
                  onChange={setSchool}
                  placeholder="Optional · RISD, SCAD, local bootcamp…"
                />
              </FormLayout>
            </VStack>
          )}

          {step === 1 && (
            <VStack gap={5}>
              <VStack gap={1}>
                <Heading level={1} type="display-3">
                  Credits unlock reviews
                </Heading>
                <Text type="body" color="secondary">
                  You can create a test right away. Reviews only start after you
                  take two peer tests and spend those credits on yours.
                </Text>
              </VStack>
              <Section padding={4} variant="muted">
                <VStack gap={4}>
                  <HStack gap={6}>
                    <VStack gap={1}>
                      <Text type="display-3" weight="semibold">
                        2
                      </Text>
                      <Text type="supporting" color="secondary">
                        tests you take
                      </Text>
                    </VStack>
                    <VStack gap={1}>
                      <Text type="display-3" weight="semibold">
                        2
                      </Text>
                      <Text type="supporting" color="secondary">
                        credits earned
                      </Text>
                    </VStack>
                    <VStack gap={1}>
                      <Text type="display-3" weight="semibold">
                        1
                      </Text>
                      <Text type="supporting" color="secondary">
                        review round
                      </Text>
                    </VStack>
                  </HStack>
                  <List hasDividers density="compact">
                    <ListItem
                      label="Create your test anytime"
                      description="Publish now. Responses stay locked until you spend."
                      startContent={<Icon icon={SparklesIcon} size="sm" />}
                    />
                    <ListItem
                      label="Take two classmate tests"
                      description="Each finish adds one credit."
                      startContent={<Icon icon={AcademicCapIcon} size="sm" />}
                    />
                    <ListItem
                      label="Spend credits to open reviews"
                      description="Two credits unlock one review round on your study."
                      startContent={<Icon icon={LockClosedIcon} size="sm" />}
                    />
                  </List>
                </VStack>
              </Section>
              <EmptyState
                isCompact
                headingLevel={3}
                icon={<Icon icon={LockClosedIcon} />}
                title="No free reviews on day one"
                description="The trade keeps the participant pool honest for student work."
              />
            </VStack>
          )}

          {step === 2 && (
            <VStack gap={5}>
              <VStack gap={1}>
                <Heading level={1} type="display-3">
                  How do you want to begin?
                </Heading>
                <Text type="body" color="secondary">
                  Either path is fine. Creating first still needs two peer tests
                  before reviews arrive.
                </Text>
              </VStack>
              <RadioList
                value={firstMove}
                onChange={(value) => setFirstMove(value as FirstMove)}
                label="First move"
              >
                <RadioListItem
                  value="create"
                  label="Create my first test"
                  description="Open the canvas, upload a screen, and publish a draft study."
                />
                <RadioListItem
                  value="take"
                  label="Take tests for credits"
                  description="Help two classmates first, then spend credits on your own review."
                />
              </RadioList>
            </VStack>
          )}
        </LayoutContent>
      }
      footer={
        <LayoutFooter hasDivider>
          <HStack gap={3} vAlign="center">
            <StackItem size="fill" style={footerZone}>
              <HStack>
                <Button
                  label={step === 0 ? "Back to Luma" : "Back"}
                  variant="secondary"
                  onClick={goBack}
                />
              </HStack>
            </StackItem>
            <Text type="supporting" color="secondary">
              {step + 1} / {STEPS.length}
            </Text>
            <StackItem size="fill" style={footerZone}>
              <HStack hAlign="end">
                <Button
                  label={
                    step === STEPS.length - 1
                      ? firstMove === "create"
                        ? "Open the canvas"
                        : "Browse open tests"
                      : "Continue"
                  }
                  variant="primary"
                  onClick={goNext}
                />
              </HStack>
            </StackItem>
          </HStack>
        </LayoutFooter>
      }
    />
  )
}
