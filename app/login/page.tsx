"use client"

import { Suspense, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/lime/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/lime/ui/card"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/lime/ui/field"
import { Input } from "@/components/lime/ui/input"
import { Separator } from "@/components/lime/ui/separator"
import { useAuth } from "@/lib/auth/auth-context"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { previewMode, loginSimulated, loginWithCredentials } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<"simulate" | "credentials" | null>(
    null
  )

  const nextPath = useMemo(() => {
    const raw = searchParams.get("next") || "/onboarding"
    return raw.startsWith("/") ? raw : "/onboarding"
  }, [searchParams])

  const isDev = previewMode === "dev"

  async function continueSimulated() {
    setError(null)
    setPending("simulate")
    try {
      await loginSimulated()
      router.push(nextPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not simulate login.")
    } finally {
      setPending(null)
    }
  }

  async function continueWithCredentials() {
    setError(null)
    setPending("credentials")
    try {
      await loginWithCredentials({ email, password })
      router.push(nextPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.")
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-4 py-10 text-fg">
      <Card variant="outline" className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="text-base font-semibold text-fg">
            Luma
          </Link>
          <CardTitle>Sign in to start a test</CardTitle>
          <CardDescription>
            {isDev
              ? "Dev preview can sign you in as a simulated student with one click."
              : "Staging preview needs school email and password before studio routes open."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {isDev ? (
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full"
                pending={pending === "simulate"}
                onClick={() => void continueSimulated()}
              >
                Continue as Dev Student
              </Button>
              <p className="text-sm text-fg-2">
                No password. Lands you in onboarding with 2 demo credits.
              </p>
            </div>
          ) : null}

          {isDev ? <Separator decorative /> : null}

          <div className="flex flex-col gap-3">
            {!isDev ? (
              <p className="text-sm font-medium text-fg">School credentials</p>
            ) : (
              <p className="text-sm font-medium text-fg">
                Or use a school email
              </p>
            )}
            <Field>
              <FieldLabel>School email</FieldLabel>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@school.edu"
                aria-invalid={Boolean(error) || undefined}
              />
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                aria-invalid={Boolean(error) || undefined}
              />
              {error ? <FieldError>{error}</FieldError> : null}
            </Field>
            <Button
              variant={isDev ? "solid" : "primary"}
              size="lg"
              className="w-full"
              pending={pending === "credentials"}
              onClick={() => void continueWithCredentials()}
            >
              Continue to Luma
            </Button>
          </div>

          <p className="text-sm text-fg-2">
            New here?{" "}
            <Link href="/onboarding" className="font-medium text-fg underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-page text-fg">
          Loading sign in…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
