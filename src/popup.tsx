import { useState } from "react";
import { MantineProvider, Paper } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { Alias, generateHash } from "~utils";
import AliasTable from "./Components/AliasTable";

export default function IndexPopup() {
  const [siteHash, setSiteHash] = useState<string>();
  const [aliases, setAliases] = useState<Alias[]>([]);

  // fetch the window data of current tab
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    async (t) =>
      // create a sha-256 hash with the URL hostname
      setSiteHash(await generateHash(new URL(t[0].url).hostname))
  );

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <NotificationsProvider>
        <Paper
          shadow="xl"
          p="sm"
          sx={{ maxWidth: 800, maxHeight: 300, minWidth: 700 }}
        >
          <AliasTable />
        </Paper>
      </NotificationsProvider>
    </MantineProvider>
  );
}
