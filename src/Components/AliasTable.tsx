import {
  ActionIcon,
  ScrollArea,
  Table,
  Tooltip,
  createStyles
} from "@mantine/core"
import { type Dispatch, type SetStateAction, useState } from "react"
import { Settings as SettingsIcon } from "tabler-icons-react"

import type { Alias, Settings } from "~utils"

import { AliasRow } from "./AliasRow"

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor: theme.colors.dark[7],
    transition: "box-shadow 150ms ease",
    zIndex: 1,
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colors.dark[3]}`
    }
  },

  scrolled: {
    boxShadow: theme.shadows.sm
  }
}))

interface AliasTableProps {
  settings: Settings
  aliases: Alias[]
  setAliases: Dispatch<SetStateAction<Alias[]>>
}
//TODO possibily cache stuff
export function AliasTable({ settings, aliases, setAliases }: AliasTableProps) {
  const [scrolled, setScrolled] = useState(false)

  const { classes, cx } = useStyles()
  return (
    <ScrollArea
      sx={{ height: 300 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      offsetScrollbars>
      <Table
        // sx={{ maxHeight: 400, maxWidth: 800, isolation: "isolate" }}
        verticalSpacing="xs">
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Alias</th>
            <th>Target</th>
            <th>Created</th>
            <th style={{ float: "right" }}>
              <Tooltip label="Settings" position="left">
                <ActionIcon
                  aria-label="Settings"
                  component="a"
                  href="/options.html"
                  target="_blank">
                  <SettingsIcon size={18} />
                </ActionIcon>
              </Tooltip>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* TODO show current website aliases on top */}
          {aliases
            .sort((a, b) => b.created - a.created)
            .map((alias) => (
              <AliasRow
                settings={settings}
                alias={alias}
                setAliases={setAliases}
                key={alias.id.toString()}
              />
            ))}
        </tbody>
      </Table>
    </ScrollArea>
  )
}
