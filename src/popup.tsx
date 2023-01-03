import { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import {
  Card,
  Group,
  MantineProvider,
  Paper,
  Skeleton,
  Switch,
  Text,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { Alias, fetchAliases, generateHash, Settings } from "~utils";
import AliasTable from "./Components/AliasTableOld";

export default function IndexPopup() {
  const [siteHash, setSiteHash] = useState<string>();
  const [aliases, setAliases] = useState<Alias[]>([]);

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
    if (!configured) return;

    (async () => {
      console.log(settings);
      // setAliases(await fetchAliases(settings));
    })();
  }, [configured]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <NotificationsProvider>
        <Paper shadow="xl" radius="md" p="xl" m="lg" withBorder>
          <Text>hello</Text>
        </Paper>
      </NotificationsProvider>
    </MantineProvider>
  );
}
