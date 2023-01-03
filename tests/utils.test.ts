import "dotenv/config";
import { describe, expect, it } from "@jest/globals";

import {
	fetchAliases,
	generateAlias,
	generateEmail,
	generateHash,
	Settings,
} from "~utils";

describe("util tests", () => {
	const settings: Settings = {
		host: process.env.TEST_MAILCOW_HOST!,
		apiKey: process.env.TEST_APIKEY!,
		forwardAddress: process.env.TEST_FORWARD_ADDRESS!,
		aliasDomain: process.env.TEST_ALIAS_DOMAIN!,
		generationMethod: 0,
	};

	// it("should generate a hash for example.com", () => {
	// 	const hash = generateHash("example.com");
	// 	expect(hash).toBe(
	// 		"a379a6f6eeafb9a55e378c118034e2751e682fab9f2d30ab13d2125586ce1947",
	// 	);
	// });

	it("should generate an email for example.com", () => {
		const email = generateEmail(settings, "example.com");

		expect(
			email.endsWith(process.env.TEST_ALIAS_DOMAIN!.split("@").pop()),
		).toBe(true);
	});

	it("should create an alias", async () => {
		const alias = await generateAlias(settings, "example.com");
		console.log(alias);
		expect(
			alias.targetAddress.endsWith(
				process.env.TEST_ALIAS_DOMAIN!.split("@").pop(),
			),
		).toBe(true);
	});

	it("should fetch aliases", async () => {
		const aliases = fetchAliases(settings);
		console.log(aliases);
	});
});
