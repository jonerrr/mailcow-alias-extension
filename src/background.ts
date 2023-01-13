import { Storage } from "@plasmohq/storage";

chrome.runtime.onInstalled.addListener(async () => {
	// set initial settings
	const storage = new Storage();
	await storage.set("settings", {
		host: "",
		apiKey: "",
		forwardAddress: "",
		aliasDomain: "",
		generationMethod: 1,
	});
	await storage.set("initialSetup", true);

	// open options page
	chrome.runtime.openOptionsPage();
});

export {};
