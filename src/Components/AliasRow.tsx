import {
  ActionIcon,
  CopyButton,
  Group,
  Skeleton,
  Text,
  Tooltip
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { type Dispatch, type SetStateAction, useState } from "react"
import {
  ClipboardCheck,
  Copy,
  Inbox,
  InboxOff,
  Trash
} from "tabler-icons-react"

import { type Alias, type Settings, deleteAlias, updateAlias } from "~utils"

dayjs.extend(relativeTime)

interface AliasRowProps {
  settings: Settings
  alias: Alias
  setAliases: Dispatch<SetStateAction<Alias[]>>
}

export function AliasRow({ settings, alias, setAliases }: AliasRowProps) {
  const [loading, setLoading] = useState(false)

  // TODO smooth animations for deletions and generating aliases
  // TODO possibly an undo button after delete that stays until you close the popup

  return (
    <tr key={alias.id.toString()}>
      <td>
        <Text
          size="md"
          weight={500}
          strikethrough={!alias.active}
          c={alias.active ? "" : "dimmed"}>
          {alias.address}
        </Text>
      </td>

      <td>
        <Text strikethrough={!alias.active} c={alias.active ? "" : "dimmed"}>
          {alias.targetAddress}
        </Text>
      </td>

      <td>
        {/* <Text>{alias.modified.toLocaleString()}</Text> */}
        <Text>{dayjs(alias.created).fromNow()}</Text>
      </td>

      {/* TODO: figure out why tooltips are under table header */}
      <td className="actions">
        <Skeleton visible={false}>
          <Group spacing={4} position="right">
            <CopyButton value={alias.address}>
              {({ copied, copy }) => (
                <Tooltip sx={{ zIndex: 2 }} label={copied ? "Copied" : "Copy"}>
                  <ActionIcon
                    aria-label="Copy"
                    onClick={copy}
                    color={copied ? "lime" : "teal"}
                    variant="light">
                    {copied ? <ClipboardCheck size={16} /> : <Copy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>

            <Tooltip label={alias.active ? "Disable" : "Enable"}>
              <ActionIcon
                aria-label={alias.active ? "Disable" : "Enable"}
                color={alias.active ? "yellow" : "lime"}
                variant="light"
                loading={loading}
                onClick={async () => {
                  setLoading(true)
                  const update = await updateAlias(
                    alias.id,
                    settings,
                    alias.active ? 0 : 1
                  )
                  if (!update) {
                    setLoading(false)
                    return notifications.show({
                      title: "Error",
                      message: `Failed to ${
                        alias.active ? "disable" : "enable"
                      } alias`,
                      color: "red"
                    })
                  }

                  alias.active = !alias.active
                  setLoading(false)
                }}>
                {alias.active ? <InboxOff size={16} /> : <Inbox size={16} />}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon
                color="red"
                variant="light"
                loading={loading}
                onClick={async () => {
                  setLoading(true)

                  const del = await deleteAlias(alias.id, settings)
                  if (!del) {
                    setLoading(false)
                    return notifications.show({
                      title: "Error",
                      message: `Failed to delete alias`,
                      color: "red"
                    })
                  }

                  setAliases((aliases) =>
                    aliases.filter((a) => a.id !== alias.id)
                  )
                  setLoading(false)
                }}>
                <Trash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Skeleton>
      </td>
    </tr>
  )
}
