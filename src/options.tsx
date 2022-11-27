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

import { GenerateUsername } from "~Components/CreateAlias";

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
  const [host, setHost] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
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
      setHost(await storage.get("host"));
      setApiKey(await storage.get("apiKey"));
      // setTargetAddress(await storage.get("target"));
    })();
  });

  const findDomains = async () => {
    try {
      if (targetAddress.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g))
        throw new Error("Invalid email");

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
        <Paper shadow="xl" m="lg" p="sm" sx={{ width: "50%" }}>
          <Stack>
            <Title>Setup</Title>
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
                  If you're sure its not your fault, check the console for more
                  details. You can create a GitHub issue{" "}
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
              withAsterisk
              label="Mailcow Host"
              description="Domain name for accessing the mailcow API"
              placeholder="https://mail.example.com"
              value={host}
              onChange={(event) => setHost(event.currentTarget.value)}
            />
            <PasswordInput
              withAsterisk
              label="API Key"
              description="You can find your mailcow API key in the administrator account (make sure it has read-write access)"
              placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX"
              value={apiKey}
              onChange={(event) => setApiKey(event.currentTarget.value)}
            />
            <TextInput
              withAsterisk
              label="Forward Address"
              description="Target address of generated aliases"
              placeholder="foo@example.tld"
              // error={
              //   target.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) &&
              //   target !== ""
              //     ? null
              //     : "Invalid email"
              // }
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
                !targetAddress.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
              }
              loading={loading}
            >
              Load Domains
            </Button>
            <Collapse in={domainList.length !== 0}>
              <Title m={10} order={2}>
                Alias Options
              </Title>
              <Select
                data={domainList}
                value={domain}
                onChange={setDomain}
                label="Alias domain:"
                transition="pop-bottom-left"
                transitionDuration={80}
                transitionTimingFunction="ease"
              />
              <Text fz="sm" mt={10}>
                Generate username with:
              </Text>
              <SegmentedControl
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
              <Text>
                {GenerateUsername(usernameType, "https://example.tld/")}@
                {domain ? domain : domainList[0]}
              </Text>
            </Collapse>
          </Stack>
        </Paper>
      </Center>
    </MantineProvider>
  );
}
