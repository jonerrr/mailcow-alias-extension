import { MantineProvider } from "@mantine/core"
import type { EmotionCache } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import type { PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
  emotionCache?: EmotionCache
}

export function ThemeProvider({ emotionCache, children }: Props) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        colors: {
          moo: [
            "#fffcde",
            "#fbf5b2",
            "#f8ef85",
            "#f6e956",
            "#f3e228",
            "#dac912",
            "#a99c09",
            "#797004",
            "#494300",
            "#191600"
          ]
        },
        primaryColor: "moo"
      }}
      emotionCache={emotionCache}>
      <Notifications />
      {children}
    </MantineProvider>
  )
}
