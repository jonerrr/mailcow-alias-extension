import type { Dispatch, SetStateAction } from "react";
import { Group, CopyButton, Tooltip, ActionIcon, Text } from "@mantine/core";
import {
  IconClipboardCheck,
  IconCopy,
  IconInboxOff,
  IconInbox,
  IconTrash,
} from "@tabler/icons";

import type { Alias } from "~utils";

interface AliasRowProps {
  alias: Alias;
  setAliases: Dispatch<SetStateAction<Alias[]>>;
}

export function AliasRow({ alias, setAliases }: AliasRowProps) {
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
        <Text>{alias.modified.toLocaleString()}</Text>
      </td>

      <td className="actions">
        <Group spacing={4} position="right">
          <CopyButton value={alias.address}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"}>
                <ActionIcon
                  onClick={copy}
                  color={copied ? "lime" : "teal"}
                  variant="light"
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
              onClick={() => console.log("enable/disable")}
            >
              alias.active ? (
              <IconInboxOff size={16} stroke={1.5} />
              ) : (
              <IconInbox size={16} stroke={1.5} />)
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              color="red"
              variant="light"
              onClick={() => console.log("delete alias")}
            >
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </td>
    </tr>
  );
}
