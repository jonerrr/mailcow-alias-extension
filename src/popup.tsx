import { MantineProvider, Paper } from "@mantine/core";

import AliasTable from "./Components/AliasTable";
import testData from "./testData";

export default function IndexPopup() {
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
