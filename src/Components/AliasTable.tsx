import { useEffect, useState } from "react";
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Alert,
  ScrollArea,
  Tooltip,
  createStyles,
  CopyButton,
  Skeleton,
  Button,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
  IconPencil,
  IconAlertCircle,
  IconCopy,
  IconClipboardCheck,
} from "@tabler/icons";
import { useStorage } from "@plasmohq/storage/hook";
import type { UsernameType } from "~options";
import { default as axios } from "axios";

import { GenerateUsername } from "./CreateAlias";

export interface Alias {
  id: number;
  domain: string;
  target: string;
  address: string;
  active: number;
  created: Date;
  modified: Date;
  hidden: boolean;
}

interface AddAlias {
  type: string;
  msg: string[];
}

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor: theme.colors.dark[7],
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colors.dark[3]}`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

function AliasRow({ alias }: { alias: Alias }) {
  return (
    <tr key={alias.id}>
      <td>
        <Text size="md" weight={500}>
          {alias.address}
        </Text>
      </td>

      <td>
        <Text
          strikethrough={alias.active === 0}
          c={alias.active === 0 ? "dimmed" : ""}
        >
          {alias.target}
        </Text>
      </td>

      <td>
        <Text>{alias.modified.toLocaleString()}</Text>
      </td>

      <td className="actions">
        <Group spacing={4} position="right">
          <CopyButton value={alias.address}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"}>
                <ActionIcon onClick={copy} color="green" variant="light">
                  {copied ? (
                    <IconClipboardCheck size={16} />
                  ) : (
                    <IconCopy size={16} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>

          <Tooltip label="Edi">
            <ActionIcon color="yellow" variant="light">
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          {/* <Tooltip label="Delete">
          <ActionIcon color="red">
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Tooltip> */}
        </Group>
      </td>
    </tr>
  );
}

export default function AliasTable() {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [aliases, setAliases] = useState<Alias[]>([]);

  const [host] = useStorage<string>("host", null);
  const [apiKey] = useStorage<string>("apiKey", null);
  const [domain] = useStorage<string>("domain", null);
  const [usernameType] = useStorage<UsernameType>("usernameType", null);
  const [target] = useStorage("target");

  const clipboard = useClipboard();

  useEffect(() => {
    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      (t) => setUrl(t[0].url)
    );

    (async () => {
      const { data } = await axios.get<
        {
          id: number;
          domain: string;
          private_comment: string;
          address: string;
          active: string;
          created: string;
          modified: string;
          goto: string;
        }[]
      >(`${host}/api/v1/get/alias/all`, {
        headers: { "x-api-key": apiKey },
      });

      setAliases(
        data
          .filter((a) => a.private_comment.startsWith("aliasextension"))
          .map((a) => {
            return {
              id: a.id,
              domain: a.domain,
              target: a.goto,
              address: a.address,
              active: parseInt(a.active),
              created: new Date(a.created),
              modified: new Date(a.created),
              hidden: false,
            };
          })
      );
    })();
  }, [host && apiKey && domain && usernameType]);

  const generateAlias = async () => {
    try {
      const addr = `${GenerateUsername(usernameType, url)}@${domain}`;

      const { data } = await axios.post<AddAlias[]>(
        `${host}/api/v1/add/alias`,
        {
          address: addr,
          goto: target,
          private_comment: `aliasextension_${new URL(url).hostname}`,
          active: "1",
        },
        { headers: { "x-api-key": apiKey } }
      );

      if (data[0].type !== "success") {
        setStatus("error");
        return setTimeout(() => setStatus(""), 4000);
      }

      setAliases([
        ...aliases,
        {
          id: parseInt(data[0].msg.pop()),
          domain: domain,
          target,
          address: addr,
          active: 1,
          created: new Date(),
          modified: new Date(),
          hidden: false,
        },
      ]);

      clipboard.copy(addr);
      setStatus("success");
      return setTimeout(() => setStatus(""), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const { classes, cx } = useStyles();

  return (
    <>
      <Group position="apart" grow sx={{ maxWidth: 800 }}>
        <Button
          mb={10}
          variant="light"
          color={status === "error" ? "red" : status === "" ? "cyan" : "green"}
          loading={loading}
          onClick={generateAlias}
        >
          {status === "error"
            ? "Error Generating Alias!"
            : status === ""
            ? "Generate Alias"
            : "Alias Successfully Generated"}
        </Button>
      </Group>
      <ScrollArea
        sx={{ height: 300 }}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        offsetScrollbars
      >
        {!host || !apiKey || !domain || !usernameType ? (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="yellow"
          >
            Missing initial configuration. Please come back after configuring
            the{" "}
            <Text c="blue" component="a" href="/options.html" target="_blank">
              extension preferences
            </Text>
            .
          </Alert>
        ) : (
          ""
        )}

        <Table sx={{ maxHeight: 400, maxWidth: 800 }} verticalSpacing="xs">
          <thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <tr>
              <th>Alias</th>
              <th>Target</th>
              <th>Modified</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {aliases.length === 0
              ? ""
              : aliases
                  .sort((a, b) => b.modified.getTime() - a.modified.getTime())
                  .map((alias) => <AliasRow alias={alias} />)}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
