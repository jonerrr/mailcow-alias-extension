import { Storage } from "@plasmohq/storage"

import { type Settings, generateAlias } from "~utils"

chrome.runtime.onInstalled.addListener(async () => {
  // set initial settings
  const storage = new Storage()
  await storage.set("settings", {
    host: "",
    apiKey: "",
    forwardAddress: "",
    aliasDomain: "",
    generationMethod: 1
  })
  await storage.set("initialSetup", true)

  // open options page
  chrome.runtime.openOptionsPage()
})

function copyToClipboard(text: string) {
  const el = document.createElement("textarea")
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

// this adds a menu item when you right click
chrome.contextMenus.create({
  title: "Generate Alias",
  id: "generateAlias",
  contexts: ["all"]
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "generateAlias") {
    const storage = new Storage()
    const settings: Settings = await storage.get("settings")

    const configured =
      settings.host &&
      settings.apiKey &&
      settings.forwardAddress &&
      settings.aliasDomain

    if (!configured) {
      // TODO error stuff
      console.log("not configured")
      return
    }

    const alias = await generateAlias(settings as Required<Settings>)
    copyToClipboard(alias.address)

    //TODO add some loading and error handling and a notification when complete
  }
})

export {}
