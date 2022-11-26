import {
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  PasswordInput,
  Text,
  TextInput,
  MantineProvider,
  Paper,
} from "@mantine/core";
import { useStorage } from "@plasmohq/storage/hook";
import useSWR, { SWRConfig } from "swr";

enum UsernameType {
  Characters = "r",
  Name = "f",
  Website = "w",
}

export default function IndexOption() {
  const [apiKey, setApiKey] = useStorage("apiKey", async (v) =>
    v === undefined ? "" : v
  );
  const [host, setHost] = useStorage("host", async (v) =>
    v === undefined ? "" : v
  );
  const [domain, setDomain] = useStorage("domain", async (v) =>
    v === undefined ? "" : v
  );
  const [usernameType, setUsernameType] = useStorage(
    "usernameType",
    async (v) => (v === undefined ? UsernameType.Characters : v)
  );

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <Paper shadow="xl" p="sm">
          {/* <Box sx={{ maxWidth: 300 }} mx="auto"> */}
          <TextInput
            withAsterisk
            label="Mailcow Domain"
            placeholder="https://mail.example.com"
          />

          <PasswordInput
            withAsterisk
            label="API Key"
            value={apiKey}
            onChange={(event) => setApiKey(event.currentTarget.value)}
          />

          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
          {/* </Box> */}
        </Paper>
      </SWRConfig>
    </MantineProvider>
  );
}
