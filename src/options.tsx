import {
  Button,
  Card,
  Center,
  Collapse,
  Container,
  createStyles,
  Group,
  Loader,
  MantineProvider,
  Modal,
  PasswordInput,
  SegmentedControl,
  Select,
  Skeleton,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  NotificationsProvider,
  showNotification,
} from "@mantine/notifications";
import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useState } from "react";

import { fetchDomains, generateEmail, Settings } from "~utils";

const useStyles = createStyles((theme) => ({
  item: {
    "& + &": {
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTop: `1px solid ${theme.colors.dark[4]}`,
    },
  },
  collapse: {
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    borderTop: `1px solid ${theme.colors.dark[4]}`,
  },
}));

export default function IndexOption() {
  const { classes } = useStyles();

  const [settings, updateSettings] = useStorage<Settings | "loading">(
    "settings",
    "loading"
  );
  const [initialSetup, setInitialSetup] = useStorage<boolean>(
    "initialSetup",
    false
  );

  const [loading, setLoading] = useState(false);

  // for temporary storage of config values. once they are valid, they are saved in storage
  const [host, setHost] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [forwardAddress, setForwardAddress] = useState("");

  const [domains, setDomains] = useState<string[]>([]);

  useEffect(() => {
    // load settings from storage only after they have loaded
    if (settings === "loading") return;

    // set the state of the config values to the values in storage
    setHost((settings as Settings).host ?? "");
    setApiKey((settings as Settings).apiKey ?? "");
    setForwardAddress((settings as Settings).forwardAddress ?? "");
  }, [settings]);

  const changesSaved =
    settings !== "loading" &&
    settings.host === host &&
    settings.apiKey === apiKey &&
    settings.forwardAddress === forwardAddress;

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
        <Modal
          opened={initialSetup}
          centered
          closeOnClickOutside={false}
          onClose={() => setInitialSetup(false)}
          title={<Text fw={700}>Thank you for installing!</Text>}
        >
          <Text c="dimmed">
            Please configure your Mailcow details to use the extension. You can
            change these settings later in the extension's options.
          </Text>
        </Modal>

        <Card
          withBorder
          radius="md"
          p="xl"
          m="lg"
          sx={{ backgroundColor: "dark.7" }}
        >
          <Skeleton visible={settings === "loading"}>
            <Group position="apart">
              <div>
                <Text size="lg" sx={{ lineHeight: 1 }} weight={700}>
                  Extension Configuration
                </Text>
                <Text size="xs" color="dimmed" mt={3} mb="xl">
                  Configure your Mailcow details and alias generation method
                </Text>
              </div>

              <Text
                size="xs"
                color="dimmed"
                c={changesSaved ? "gray.4" : "red.8"}
              >
                {changesSaved ? "All changes saved" : "Unsaved changes"}
              </Text>
            </Group>

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
                  event.currentTarget.value.match(
                    /^(https?:\/\/)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/gi
                  )
                    ? updateSettings({
                        ...(settings as Settings),
                        host: event.currentTarget.value,
                      })
                    : setHost(event.currentTarget.value);
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
                onChange={(event) => {
                  // replace any character that can't be part of an API key.
                  // it is easy to accidentally copy a bunch of spaces or newlines when copying the API key
                  const cleaned = event.currentTarget.value.replace(
                    /[^\w\d-]+/g,
                    ""
                  );
                  cleaned.match(/^([\w]{6}-){4}[\w]{6}$/g)
                    ? updateSettings({
                        ...(settings as Settings),
                        apiKey: cleaned,
                      })
                    : setApiKey(cleaned);
                }}
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
                onChange={(event) => {
                  event.currentTarget.value.match(
                    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/g
                  )
                    ? updateSettings({
                        ...(settings as Settings),
                        forwardAddress: event.currentTarget.value,
                      })
                    : setForwardAddress(event.currentTarget.value);
                }}
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

            <Collapse in={!!domains.length} className={classes.collapse}>
              <Group position="apart" noWrap spacing="xl">
                <div>
                  <Text>Alias Domain</Text>
                  <Text size="xs" color="dimmed">
                    Default domain used for generating aliases
                  </Text>
                </div>
                <Select
                  size="md"
                  sx={{ width: "30%" }}
                  data={domains}
                  value={(settings as Settings).aliasDomain}
                  onChange={(value) =>
                    updateSettings({
                      ...(settings as Settings),
                      aliasDomain: value,
                    })
                  }
                  transition="pop-top-left"
                  transitionDuration={80}
                  transitionTimingFunction="ease"
                />
              </Group>

              <Group
                position="apart"
                noWrap
                spacing="xl"
                className={classes.collapse}
              >
                <div>
                  <Text>Generation Method</Text>
                  <Text size="xs" color="dimmed">
                    How the alias addresses should be generated
                  </Text>
                </div>
                <SegmentedControl
                  size="md"
                  sx={{ width: "30%" }}
                  data={[
                    { label: "Random Characters", value: "0" },
                    { label: "Random Name", value: "1" },
                    { label: "Website URL", value: "2" },
                  ]}
                  value={(settings as Settings).generationMethod?.toString()}
                  onChange={(value) =>
                    updateSettings({
                      ...(settings as Settings),
                      generationMethod: parseInt(value),
                    })
                  }
                />
              </Group>

              <Group
                position="apart"
                noWrap
                spacing="xl"
                className={classes.collapse}
              >
                <div>
                  <Title order={2}>Example Alias</Title>
                </div>
                <Text>
                  {generateEmail(settings as Required<Settings>, "example.com")}
                </Text>
              </Group>
            </Collapse>

            <Group position="center" mt="sm" pt="sm">
              <Button
                variant="light"
                size="xl"
                fullWidth
                loading={loading}
                disabled={
                  !(
                    settings !== "loading" &&
                    settings.host &&
                    settings.apiKey &&
                    settings.forwardAddress
                  )
                }
                onClick={() => {
                  (async () => {
                    setLoading(true);
                    try {
                      const domains = await fetchDomains(
                        settings as Required<Settings>
                      );
                      if (!domains.length)
                        return showNotification({
                          title: "No Domains Found",
                          message:
                            "No valid domains were found on your Mailcow instance",
                          color: "red",
                        });
                      setDomains(domains);
                    } catch (e) {
                      console.error(e);
                      showNotification({
                        title: "Error fetching Mailcow information",
                        message: e.message,
                        color: "red",
                      });
                    }
                    setLoading(false);
                  })();
                }}
              >
                {loading ? "Loading" : "Load"} Mailcow Information
              </Button>
            </Group>
          </Skeleton>
        </Card>
      </NotificationsProvider>
    </MantineProvider>
  );
}
