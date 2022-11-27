import { MantineProvider, Paper } from "@mantine/core";

import AliasTable from "./Components/AliasTable";
import testData from "./testData";
import { useEffect } from "react";
import { useState } from "react";

export default function IndexPopup() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    (async () => {
      chrome.tabs.query(
        { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
        (t) => setUrl(t[0].url)
      );
    })();
  });

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <Paper shadow="xl" p="sm">
        <AliasTable aliases={testData} />
      </Paper>
    </MantineProvider>
  );
}
