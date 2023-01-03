import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "@mantine/core";

import type { Alias } from "~utils";

interface GenerateAliasButtonProps {
  aliases: Alias[];
  setAliases: Dispatch<SetStateAction<Alias[]>>;
}

export function GenerateAliasButton({
  aliases,
  setAliases,
}: GenerateAliasButtonProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      sx={{
        width: "100%",
        isolation: "isolate",
        zIndex: 1,
      }}
      variant="light"
      color={status === "error" ? "red" : status === "" ? "grape" : "green"}
      loading={false}
      onClick={() => {}}
    >
      {status === "error"
        ? "Error Generating Alias!"
        : status === ""
        ? "Generate Alias"
        : "Alias Successfully Generated"}
    </Button>
  );
}
