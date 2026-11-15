"use client"

import { useState } from "react"
import { Button } from "@astryxdesign/core/Button"
import { Card } from "@astryxdesign/core/Card"
import { Table } from "@astryxdesign/core/Table"
import { TextInput } from "@astryxdesign/core/TextInput"
import { VStack } from "@astryxdesign/core/VStack"

/** Temporary smoke page: confirm Astryx cascade/theme before migrating UI. */
export default function FoundationCheckPage() {
  const [email, setEmail] = useState("")

  return (
    <div data-foundation-check className="p-8">
      <VStack gap={4}>
        <Button label="Primary action" variant="primary" />
        <TextInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />
        <Card>One card with default padding</Card>
        <Table
          data={[{ name: "Foundation", status: "ok" }]}
          columns={[
            { key: "name", header: "Name" },
            { key: "status", header: "Status" },
          ]}
        />
      </VStack>
    </div>
  )
}
