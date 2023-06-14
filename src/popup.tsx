import { useState, useEffect, SetStateAction } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import {
  Alert,
  Card,
  Group,
  Loader,
  MantineProvider,
  Paper,
  Skeleton,
  Switch,
  Text,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { Alias, fetchAliases, generateHash, Settings } from "~utils";
import { AliasTable } from "~Components/AliasTable";
import { IconAlertCircle } from "@tabler/icons";

export default function IndexPopup() {
  const [siteHash, setSiteHash] = useState<string>();
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [loading, setLoading] = useState(true);

  // initialize as loading and then set to the actual value
  const [settings] = useStorage<Settings | "loading">("settings", "loading");

  // fetch the window data of current tab
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    async (t) =>
      // create a sha-256 hash with the URL hostname
      setSiteHash(await generateHash(new URL(t[0].url).hostname))
  );

  const configured =
    settings !== "loading" &&
    settings.host &&
    settings.apiKey &&
    settings.forwardAddress &&
    settings.aliasDomain;

  useEffect(() => {
    if (configured)
      (async () => {
        console.log(settings);
        await new Promise((r) => setTimeout(r, 1000));
        setAliases([
          {
            id: 1,
            domain: "example.tkd",
            targetAddress: "test@example.tld",
            address: "person@example.tld",
            active: true,
            created: new Date("December 17, 2022 03:24:00"),
            modified: new Date("January 15, 2023 10:24:00"),
            siteHash: siteHash,
          },
        ]);
        // setAliases(await fetchAliases(settings));
      })();
    setLoading(false);
  }, [configured]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <NotificationsProvider>
        <Paper
          shadow="xl"
          radius="md"
          p="lg"
          m="lg"
          withBorder
          sx={{ minWidth: "700px", minHeight: "400px" }}
        >
          <Skeleton
            visible={settings === "loading" || loading}
            sx={{ minWidth: "700px", minHeight: "400px" }}
          >
            {configured ? (
              <AliasTable
                settings={settings}
                aliases={aliases}
                setAliases={setAliases}
              />
            ) : (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Warning"
                color="yellow"
                radius="md"
              >
                Initial setup is missing to begin using this extension. Please
                visit the{" "}
                <a href="/options.html" target="_blank">
                  options
                </a>{" "}
                page and configure your Mailcow instance.
              </Alert>
            )}
          </Skeleton>
        </Paper>
      </NotificationsProvider>
    </MantineProvider>
  );
}
