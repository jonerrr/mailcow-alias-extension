import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";
import { useState } from "react";

import type { Settings } from "~utils";

export default function IndexOption() {
  const [settings, updateSettings] = useStorage<Settings>("settings", () =>
    s ? JSON.parse(s) : {}
  );

  const storage = new Storage();
}
