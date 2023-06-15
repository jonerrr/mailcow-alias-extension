import {
  Alert,
  Card,
  Group,
  Loader,
  MantineProvider,
  Paper,
  Skeleton,
  Switch,
  Text
} from "@mantine/core"
import { type SetStateAction, useEffect, useState } from "react"
import { AlertCircle } from "tabler-icons-react"

import { useStorage } from "@plasmohq/storage/hook"

import { AliasTable } from "~Components/AliasTable"
import { ThemeProvider } from "~theme"
import { type Alias, type Settings, fetchAliases, generateHash } from "~utils"

export default function IndexPopup() {
  const [siteHash, setSiteHash] = useState<string>()
  const [aliases, setAliases] = useState<Alias[]>([])
  const [loading, setLoading] = useState(true)

  // initialize as loading and then set to the actual value
  const [settings] = useStorage<Settings | "loading">("settings", "loading")

  // fetch the window data of current tab
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    async (t) =>
      // create a sha-256 hash with the URL hostname
      setSiteHash(await generateHash(new URL(t[0].url).hostname))
  )

  const configured =
    settings !== "loading" &&
    settings.host &&
    settings.apiKey &&
    settings.forwardAddress &&
    settings.aliasDomain

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }
    ;(async () => {
      await new Promise((r) => setTimeout(r, 1000))
      // setAliases([
      //   {
      //     id: 1,
      //     domain: "example.tkd",
      //     targetAddress: "test@example.tld",
      //     address: "person@example.tld",
      //     active: true,
      //     created: Date.now(),
      //     modified: new Date("January 15, 2023 10:24:00"),
      //     siteHash: siteHash,
      //   },
      // ]);
      setAliases(await fetchAliases(settings as Required<Settings>))
      setLoading(false)
    })()
  }, [configured])

  return (
    <ThemeProvider>
      {/* <Paper
          shadow="xl"
          radius="md"
          p="lg"
          m="lg"
          withBorder
          sx={{ minWidth: "700px", minHeight: "400px" }}
        > */}
      <Skeleton
        visible={settings === "loading" || loading}
        sx={{ minWidth: "700px", minHeight: "400px" }}>
        {configured ? (
          <AliasTable
            settings={settings}
            aliases={aliases}
            setAliases={setAliases}
          />
        ) : (
          <Alert
            icon={<AlertCircle size={16} />}
            title="Warning"
            color="yellow"
            radius="md">
            Initial setup is missing to begin using this extension. Please visit
            the{" "}
            <a href="/options.html" target="_blank">
              options
            </a>{" "}
            page and configure your Mailcow instance.
          </Alert>
        )}
      </Skeleton>
      {/* </Paper> */}
    </ThemeProvider>
  )
}
