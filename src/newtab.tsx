import { Center, MantineProvider, Title } from "@mantine/core";
import { Storage } from "@plasmohq/storage";
import { useEffect } from "react";

function IndexNewtab() {
  const storage = new Storage();

  useEffect(() => {
    (async () => {
      await storage.set("settings", {
        host: null,
        apiKey: null,
        forwardAddress: null,
        aliasDomain: null,
        generationMethod: 1,
      });
    })();
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <Center>
        <Title>Thanks for installing!</Title>
      </Center>
    </MantineProvider>
  );
}

export default IndexNewtab;
