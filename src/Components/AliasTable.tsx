import { Dispatch, SetStateAction, useState } from "react";
import {
  ScrollArea,
  Table,
  Tooltip,
  ActionIcon,
  createStyles,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons";

import type { Alias } from "~utils";
import { AliasRow } from "./AliasRow";

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
      borderBottom: `1px solid ${theme.colors.dark[3]}`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface AliasTableProps {
  aliases: Alias[];
  setAliases: Dispatch<SetStateAction<Alias[]>>;
}

export function AliasTable({ aliases, setAliases }: AliasTableProps) {
  const [scrolled, setScrolled] = useState(false);

  const { classes, cx } = useStyles();

  return (
    <ScrollArea
      sx={{ height: 300 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      offsetScrollbars
    >
      <Table
        sx={{ maxHeight: 400, maxWidth: 800, isolation: "isolate" }}
        verticalSpacing="xs"
      >
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Alias</th>
            <th>Target</th>
            <th>Created</th>
            <th style={{ float: "right" }}>
              <Tooltip label="Settings" position="left">
                <ActionIcon component="a" href="/options.html" target="_blank">
                  <IconSettings size={18} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </th>
          </tr>
        </thead>
        <tbody>
          {aliases
            .sort((a, b) => b.created.getTime() - a.created.getTime())
            .map((alias) => (
              <AliasRow alias={alias} setAliases={setAliases} />
            ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
