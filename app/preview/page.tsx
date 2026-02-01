import { Suspense } from "react"
import { TestPreview } from "@/components/preview/test-preview"

interface PreviewPageProps {
  searchParams: Promise<{ data?: string }>
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const params = await searchParams
  const encodedData = params.data

  if (!encodedData) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">No test data</h1>
          <p className="text-muted-foreground">Please open a preview from the test creator.</p>
        </div>
      </div>
    )
  }

  try {
    const decodedData = JSON.parse(decodeURIComponent(encodedData))
    return (
      <Suspense fallback={<div className="flex items-center justify-center h-screen bg-background">Loading...</div>}>
        <TestPreview testData={decodedData} />
      </Suspense>
    )
  } catch {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Invalid test data</h1>
          <p className="text-muted-foreground">The test data could not be decoded. Please try again.</p>
        </div>
      </div>
    )
  }
}
