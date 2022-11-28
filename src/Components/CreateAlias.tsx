import Chance from "chance";
import { Button, Group } from "@mantine/core";
import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useState } from "react";
import { default as axios } from "axios";

import { UsernameType } from "~options";

interface AddAlias {
  type: string;
}

const chance = new Chance();

export function GenerateUsername(usernameType: UsernameType, url?: string) {
  switch (usernameType) {
    case UsernameType.Characters:
      return chance.string({ length: 20, alpha: true, numeric: true });
    case UsernameType.Name:
      return (
        chance.first() + chance.last() + chance.integer({ min: 10, max: 1000 })
      );
    // there might be some website that turns into an invalid domain name idk
    case UsernameType.Website:
      return (
        new URL(url).hostname.replaceAll(".", "-") +
        chance.integer({ min: 10, max: 1000 })
      ).substring(0, 64);
  }
}

export default function CreateAlias() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  const [host] = useStorage("host");
  const [apiKey] = useStorage("apiKey");
  const [usernameType] = useStorage("usernameType");
  const [target] = useStorage("target");

  useEffect(() => {
    (async () => {
      chrome.tabs.query(
        { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
        (t) => setUrl(t[0].url)
      );
    })();
  });

  const generateAlias = async () => {
    try {
      const { data } = await axios.post<AddAlias>(`${host}/api/v1/add/alias`, {
        headers: { "x-api-key": apiKey },
        data: {
          address: GenerateUsername(usernameType, url),
          goto: target,
        },
      });

      if (data.type !== "success") {
        setError(true);
        setTimeout(() => setError(false), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Group position="apart" grow sx={{ maxWidth: 800 }}>
      <Button
        variant="light"
        color={error ? "red" : "cyan"}
        loading={loading}
        onClick={() => {
          setLoading(true);
          generateAlias();
          setLoading(false);
        }}
      >
        {error ? "Error Generating Alias!" : "Generate Alias"}
      </Button>
    </Group>
  );
}
