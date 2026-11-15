"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@astryxdesign/core/Button"
import { Card } from "@astryxdesign/core/Card"
import { Center } from "@astryxdesign/core/Center"
import { Divider } from "@astryxdesign/core/Divider"
import { Link as AstryxLink } from "@astryxdesign/core/Link"
import { Section } from "@astryxdesign/core/Section"
import { HStack, VStack } from "@astryxdesign/core/Stack"
import { Text } from "@astryxdesign/core/Text"
import { TextInput } from "@astryxdesign/core/TextInput"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Add your school email and a password to continue.")
      return
    }
    setError(null)
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoading(false)
    router.push("/onboarding")
  }

  return (
    <Center axis="both" padding={6} minHeight="100vh">
      <Card padding={0} maxWidth={440} width="100%">
        <Section padding={6} variant="transparent">
          <VStack gap={5}>
            <VStack gap={1}>
              <AstryxLink href="/" as={Link} type="large" weight="bold" color="primary">
                Luma
              </AstryxLink>
              <Text type="display-3" weight="semibold">
                Sign in to start a test
              </Text>
              <Text type="body" color="secondary">
                Create now. Reviews unlock after two peer tests and a credit
                spend.
              </Text>
            </VStack>

            <VStack gap={3}>
              <TextInput
                label="School email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@school.edu"
                status={error ? { type: "error", message: error } : undefined}
              />
              <TextInput
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />
              <Button
                label="Continue to Luma"
                variant="primary"
                width="100%"
                isLoading={isLoading}
                clickAction={handleLogin}
              />
            </VStack>

            <Divider label="or" />

            <HStack gap={2} hAlign="center">
              <Text type="supporting" color="secondary">
                New here?
              </Text>
              <AstryxLink href="/onboarding" as={Link} type="supporting">
                Create an account
              </AstryxLink>
            </HStack>
          </VStack>
        </Section>
      </Card>
    </Center>
  )
}
