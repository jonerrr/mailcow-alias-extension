import { Dispatch, SetStateAction, useState } from "react";
import {
  Group,
  CopyButton,
  Tooltip,
  ActionIcon,
  Text,
  Skeleton,
} from "@mantine/core";
import {
  IconClipboardCheck,
  IconCopy,
  IconInboxOff,
  IconInbox,
  IconTrash,
} from "@tabler/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Alias, updateAlias, Settings } from "~utils";

dayjs.extend(relativeTime);

interface AliasRowProps {
  settings: Settings;
  alias: Alias;
  setAliases: Dispatch<SetStateAction<Alias[]>>;
}

export function AliasRow({ settings, alias, setAliases }: AliasRowProps) {
  const [loading, setLoading] = useState(false);

  // TODO smooth animations for deletions and generating aliases
  // TODO possibly an undo button after delete that stays until you close the popup

  return (
    <tr key={alias.id.toString()}>
      <td>
        <Text
          size="md"
          weight={500}
          strikethrough={alias.active}
          c={alias.active ? "dimmed" : ""}
        >
          {alias.address}
        </Text>
      </td>

      <td>
        <Text strikethrough={alias.active} c={alias.active ? "dimmed" : ""}>
          {alias.targetAddress}
        </Text>
      </td>

      <td>
        {/* <Text>{alias.modified.toLocaleString()}</Text> */}
        <Text>{dayjs(alias.modified).fromNow()}</Text>
      </td>

      <td className="actions">
        <Skeleton visible={false}>
          <Group spacing={4} position="right">
            <CopyButton value={alias.address}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy"}>
                  <ActionIcon
                    onClick={copy}
                    color={copied ? "lime" : "teal"}
                    variant="light"
                    // loading={loading}
                  >
                    {copied ? (
                      <IconClipboardCheck size={16} />
                    ) : (
                      <IconCopy size={16} />
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>

            <Tooltip label={alias.active ? "Disable" : "Enable"}>
              <ActionIcon
                color={alias.active ? "yellow" : "lime"}
                variant="light"
                onClick={async () => {
                  setLoading(true);
                  const update = await updateAlias(
                    alias.id,
                    settings,
                    +alias.active as 0 | 1
                  );
                  if (!update) {
                    // TODO send error notif
                  }

                  //TODO update alias
                }}
                // loading={loading}
              >
                {alias.active ? (
                  <IconInboxOff size={16} stroke={1.5} />
                ) : (
                  <IconInbox size={16} stroke={1.5} />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon
                color="red"
                variant="light"
                onClick={() => console.log("delete alias")}
                // loading={loading}
              >
                <IconTrash size={16} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Skeleton>
      </td>
    </tr>
  );
}
