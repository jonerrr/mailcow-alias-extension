import { useEffect, useState } from "react";
import { MantineProvider, Paper } from "@mantine/core";
import { SWRConfig } from "swr";
import { default as axios } from "axios";

import AliasTable from "./Components/AliasTable";
// import testData from "./testData";
import CreateAlias from "~Components/CreateAlias";

export default function IndexPopup() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      {/* <SWRConfig
        value={{
          fetcher: (url, key: string) =>
            axios
              .get(url, { headers: { "x-api-key": key } })
              .then((res) => res.data),
        }}
      > */}
      <Paper shadow="xl" p="sm">
        {/* <CreateAlias /> */}
        <AliasTable />
      </Paper>
      {/* </SWRConfig> */}
    </MantineProvider>
  );
}
