import { useState } from "react";
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  ScrollArea,
  useMantineTheme,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { IconPencil, IconTrash, IconInboxOff, IconInbox } from "@tabler/icons";

export interface Alias {
  id: number;
  domain: string;
  goto: string;
  address: string;
  active: 0 | 1;
  created: Date;
  modified: Date;
  hidden: boolean;
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
  const [editing, setEditing] = useState(false);

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
          {alias.goto}
        </Text>
      </td>

      <td>
        <Text>{alias.modified.toLocaleString()}</Text>
      </td>

      <td className="actions">
        <Group spacing={0} position="right">
          <Tooltip label="Edit">
            <ActionIcon>
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

export default function AliasTable({ aliases }: { aliases: Alias[] }) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = aliases
    .sort((a, b) => b.modified.getTime() - a.modified.getTime())
    .map((alias) => <AliasRow alias={alias} />);

  return (
    <ScrollArea
      sx={{ height: 300 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table sx={{ maxHeight: 400, maxWidth: 800 }} verticalSpacing="xs">
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Alias</th>
            <th>Target</th>
            <th>Modified</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
