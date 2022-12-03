import { MantineProvider, Paper } from "@mantine/core";

import AliasTable from "./Components/AliasTable";

export default function IndexPopup() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <Paper
        shadow="xl"
        p="sm"
        sx={{ maxWidth: 800, maxHeight: 300, minWidth: 700 }}
      >
        <AliasTable />
      </Paper>
    </MantineProvider>
  );
}
