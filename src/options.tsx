import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";
import { default as axios } from "axios";
import {
  Alert,
  Button,
  PasswordInput,
  Text,
  TextInput,
  MantineProvider,
  Paper,
  Center,
  Title,
  Collapse,
  Stack,
  Select,
  SegmentedControl,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

import { GenerateUsername } from "~Components/AliasTable";

export enum UsernameType {
  Characters = "c",
  Name = "n",
  Website = "w",
}

interface Domain {
  active: number;
  aliases_left: number;
  domain_name: string;
}

export default function IndexOption() {
  const [host, setHost] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [targetAddress, setTargetAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setError] = useState(false);
  const [domainList, setDomains] = useState<string[]>([]);
  const [domain, setDomain] = useStorage("domain");
  const [usernameType, setUsernameType] = useStorage(
    "usernameType",
    async (v) => (v === undefined ? UsernameType.Characters : v)
  );
  const storage = new Storage();

  useEffect(() => {
    (async () => {
      const h = await storage.get("host");
      const a = await storage.get("apiKey");
      const t = await storage.get("target");
      if (h) setHost(h);
      if (a) setApiKey(a);
      if (t) setTargetAddress(t);
    })();
  }, []);

  const findDomains = async () => {
    try {
      const domains = await axios.get<Domain[]>(
        `${host}/api/v1/get/domain/all`,
        {
          headers: { "x-api-key": apiKey },
        }
      );

      await storage.set("apiKey", apiKey);
      await storage.set("host", host);
      await storage.set("target", targetAddress);

      setDomains(
        domains.data
          .filter((d) => d.active === 1 && d.aliases_left !== 0)
          .map((d) => d.domain_name)
      );
      setError(false);
    } catch (e) {
      console.error(e);
      console.log(Object.keys(e));
      setError(true);
    }
  };

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <Center>
        <Paper shadow="xl" m="sm" p="sm" sx={{ width: "50%" }}>
          <Stack>
            <Title>Mailcow Setup</Title>
            <Collapse in={fetchError}>
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Error"
                color="red"
                mb={10}
              >
                Failed to fetch list of domains from mailcow. Make sure your API
                key, host, and target address are valid.
                <Text c="dimmed">
                  Check the console for more details. If you're sure its not
                  your fault, you can create a GitHub issue{" "}
                  <Text
                    c="blue"
                    component="a"
                    href="https://github.com/jonerrr/mailow-alias-extension/issues/new"
                    target="_blank"
                  >
                    here
                  </Text>
                  .
                </Text>
              </Alert>
            </Collapse>
            <TextInput
              size="lg"
              withAsterisk
              label="Mailcow Host"
              description="The domain used for accessing the mailcow API"
              placeholder="https://mail.example.com"
              value={host}
              onChange={(event) => setHost(event.currentTarget.value)}
            />
            <PasswordInput
              size="lg"
              withAsterisk
              label="API Key"
              description="You can enable the mailcow API in an administrator account. Make sure the API key has read and write access."
              placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX"
              value={apiKey}
              onChange={(event) => setApiKey(event.currentTarget.value)}
            />
            <TextInput
              size="lg"
              withAsterisk
              label="Forward Address"
              description="Emails will be forwarded to this address. This must be an email in mailcow."
              placeholder="foo@example.tld"
              value={targetAddress}
              onChange={(event) => setTargetAddress(event.currentTarget.value)}
            />
            <Button
              size="xl"
              variant="light"
              onClick={() => {
                setLoading(true);
                findDomains();
                setLoading(false);
              }}
              disabled={
                apiKey === "" ||
                host === "" ||
                targetAddress === "" ||
                !apiKey.match(/^([\w]{6}-){4}[\w]{6}$/g) ||
                !host.match(
                  /^(https?:\/\/)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/gi
                ) ||
                !targetAddress.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/g)
              }
              loading={loading}
            >
              Load Domains
            </Button>
            <Collapse in={domainList.length !== 0}>
              <Title>Alias Options</Title>
              <Select
                data={domainList}
                value={domain}
                onChange={setDomain}
                label="Alias domain"
                transition="pop-bottom-left"
                transitionDuration={80}
                transitionTimingFunction="ease"
              />
              <Text fz="sm" fw={500} mt={10}>
                Generate username with
              </Text>
              <SegmentedControl
                fullWidth
                value={usernameType}
                onChange={setUsernameType}
                data={[
                  { label: "Random Characters", value: "c" },
                  { label: "Random Name", value: "n" },
                  { label: "Website URL", value: "w" },
                ]}
              />

              <Title order={3} mt={10}>
                Example Alias
              </Title>
              <Text c="blue">
                {GenerateUsername(usernameType, "https://mail.google.com/")}@
                {domain ? domain : domainList[0]}
              </Text>
            </Collapse>
          </Stack>
        </Paper>
      </Center>
    </MantineProvider>
  );
}
