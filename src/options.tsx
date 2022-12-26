import {
  Button,
  Card,
  Center,
  Container,
  createStyles,
  Group,
  MantineProvider,
  PasswordInput,
  Skeleton,
  Text,
  TextInput,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useState } from "react";

import type { Settings } from "~utils";

const useStyles = createStyles((theme) => ({
  item: {
    "& + &": {
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTop: `1px solid ${theme.colors.dark[4]}`,
    },
  },
}));

export default function IndexOption() {
  const { classes } = useStyles();

  const [settings, updateSettings] = useStorage<Settings | "loading">(
    "settings",
    "loading"
  );

  console.log(settings);

  // for temporary storage of config values. once they are valid, they are saved in storage
  const [host, setHost] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [forwardAddress, setForwardAddress] = useState("");
  const [domains, setDomains] = useState<string[]>();

  // load settings from storage only after they have loaded
  useEffect(() => {
    if (settings === "loading") return;

    setHost((settings as Settings).host ?? "");
    setApiKey((settings as Settings).apiKey ?? "");
    setForwardAddress((settings as Settings).forwardAddress ?? "");
  }, [settings]);

  // save host if valid
  useEffect(() => {
    if (
      host.match(
        /^(https?:\/\/)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/gi
      ) &&
      settings !== "loading"
    )
      updateSettings({ ...(settings as Settings), host });
  }, [host]);

  // save API key if valid
  useEffect(() => {
    if (apiKey.match(/^([\w]{6}-){4}[\w]{6}$/g) && settings !== "loading")
      updateSettings({ ...(settings as Settings), apiKey });
  }, [apiKey]);

  // save forwarding address if valid
  useEffect(() => {
    if (
      forwardAddress.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/g) &&
      settings !== "loading"
    )
      updateSettings({ ...(settings as Settings), forwardAddress });
  }, [forwardAddress]);
  // TODO unsaved / saved changes status indicator

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        colors: {
          moo: [
            "#fffcde",
            "#fbf5b2",
            "#f8ef85",
            "#f6e956",
            "#f3e228",
            "#dac912",
            "#a99c09",
            "#797004",
            "#494300",
            "#191600",
          ],
        },
        primaryColor: "moo",
      }}
    >
      <NotificationsProvider>
        <Card
          withBorder
          radius="md"
          p="xl"
          m="lg"
          sx={{ backgroundColor: "dark.7" }}
        >
          <Skeleton visible={settings === "loading"}>
            <Text size="lg" sx={{ lineHeight: 1 }} weight={700}>
              Extension Configuration
            </Text>
            <Text size="xs" color="dimmed" mt={3} mb="xl">
              Configure your Mailcow details and alias generation method
            </Text>

            <Group
              position="apart"
              noWrap
              spacing="xl"
              className={classes.item}
            >
              <div>
                <Text>Host</Text>
                <Text size="xs" color="dimmed">
                  URL of your Mailcow instance
                </Text>
              </div>
              <TextInput
                value={host}
                onChange={(event) => {
                  setHost(event.currentTarget.value);
                }}
                error={
                  host === "" ||
                  host.match(
                    /^(https?:\/\/)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/gi
                  )
                    ? null
                    : "Invalid Host"
                }
                placeholder="https://mail.example.com"
                size="md"
                sx={{ width: "30%" }}
              />
            </Group>

            <Group
              position="apart"
              noWrap
              spacing="xl"
              className={classes.item}
            >
              <div>
                <Text>API Key</Text>
                <Text size="xs" color="dimmed">
                  API key of your Mailcow instance
                </Text>
              </div>
              <PasswordInput
                value={apiKey}
                onChange={(event) =>
                  // replace any character that can't be part of an API key.
                  // it is easy to accidentally copy a bunch of spaces or newlines when copying the API key
                  setApiKey(event.currentTarget.value.replace(/[^\w\d-]+/g, ""))
                }
                error={
                  apiKey === "" || apiKey.match(/^([\w]{6}-){4}[\w]{6}$/g)
                    ? null
                    : "Invalid API Key"
                }
                placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX"
                size="md"
                sx={{ width: "30%" }}
              />
            </Group>

            <Group
              position="apart"
              noWrap
              spacing="xl"
              className={classes.item}
            >
              <div>
                <Text>Forwarding Address</Text>
                <Text size="xs" color="dimmed">
                  Default address for email to be forwarded to
                </Text>
              </div>
              <TextInput
                value={forwardAddress}
                onChange={(event) =>
                  setForwardAddress(event.currentTarget.value)
                }
                error={
                  forwardAddress === "" ||
                  forwardAddress.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/g)
                    ? null
                    : "Invalid Email Address"
                }
                placeholder="example@example.com"
                size="md"
                sx={{ width: "30%" }}
              />
            </Group>
          </Skeleton>
        </Card>
      </NotificationsProvider>
    </MantineProvider>
  );
}
