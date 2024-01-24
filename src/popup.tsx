import { Alert, Skeleton } from "@mantine/core"
import { useEffect, useState } from "react"
import { AlertCircle } from "tabler-icons-react"
import { useStorage } from "@plasmohq/storage/hook"
import { AliasTable } from "~Components/AliasTable"
import { ThemeProvider } from "~theme"
import { type Alias, type Settings, fetchAliases, generateHash } from "~utils"

export default function IndexPopup() {
  //TODO: rename because its no longer a hash
  const [siteHash, setSiteHash] = useState<string>()
  const [aliases, setAliases] = useState<Alias[]>([])
  const [loading, setLoading] = useState(true)

  // initialize as loading and then set to the actual value
  const [settings] = useStorage<Settings | "loading">("settings", "loading")

  // fetch the window data of current tab
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    async (t) =>

      setSiteHash(new URL(t[0].url!).hostname)
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

    ; (async () => {
      await new Promise((r) => setTimeout(r, 1000))
      setAliases(await fetchAliases(settings as Required<Settings>))
      setLoading(false)
    })()
  }, [configured])

  return (
    <ThemeProvider>
      <Skeleton
        visible={settings === "loading" || loading}
        sx={{ minWidth: "600px", minHeight: "300px" }}>
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
            color="yellow">
            Initial setup is missing to begin using this extension. Please visit
            the{" "}
            <a href="/options.html" target="_blank">
              options
            </a>{" "}
            page and configure your Mailcow instance.
          </Alert>
        )}
      </Skeleton>
    </ThemeProvider>
  )
}
