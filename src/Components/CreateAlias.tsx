import Chance from "chance";
import { Button } from "@mantine/core";

import { UsernameType } from "~options";

const chance = new Chance();

export function GenerateUsername(usernameType: UsernameType, url?: string) {
  switch (usernameType) {
    case UsernameType.Characters:
      return chance.string({ length: 12, alpha: true, numeric: true });
    case UsernameType.Name:
      return (
        chance.first() + chance.last() + chance.integer({ min: 10, max: 1000 })
      );
    case UsernameType.Website:
      return (
        new URL(url).hostname.replace(".", "-") +
        chance.integer({ min: 10, max: 1000 })
      ).substring(0, 64);
  }
}

export default function CreateAlias() {
  return <Button>Generate Alias</Button>;
}
