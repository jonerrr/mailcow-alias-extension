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
        <Paper
          shadow="xl"
          radius="md"
          p="lg"
          m="lg"
          withBorder
          sx={{ minWidth: "700px", minHeight: "400px" }}
        >
          <Skeleton
            visible={settings === "loading"}
            sx={{ minWidth: "700px", minHeight: "400px" }}
          >
            {configured ? (
              <AliasTable aliases={aliases} setAliases={setAliases} />
            ) : (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Warning"
                color="yellow"
                radius="md"
              >
                Initial setup is missing to begin using this extension. Please
                visit the options page and configure your Mailcow instance.
              </Alert>
            )}
            {/* <Alert
              icon={<IconAlertCircle size={16} />}
              title="Warning"
              color="yellow"
              radius="md"
            >
              Initial setup is missing to begin using this extension. Please
              visit the options page and configure your Mailcow instance.
            </Alert> */}
          </Skeleton>
        </Paper>
      </NotificationsProvider>
    </MantineProvider>
  );
}
