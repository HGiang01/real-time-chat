import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx"
import { Spinner } from "@/components/ui/spinner.tsx"

interface ScreenLoaderProps {
  title: string
  subtitle?: string
}

function ScreenLoader({ title, subtitle }: ScreenLoaderProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {subtitle && <EmptyDescription>{subtitle}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  )
}

export { ScreenLoader }
