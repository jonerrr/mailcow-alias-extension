export interface Alias {
	// id that mailcow assigns alias
	id: number;
	// domain of alias
	domain: string;
	targetAddress: string;
	aliasAddress: string;
	// 0 is disabled, 1 is enabled
	active: number;
	created: Date;
	modified: Date;
	// hash of site
	siteHash: string;
}

enum GenerationMethod {
	RandomCharacters = 0,
	RandomName = 1,
	WebsiteURL = 2,
}

export interface Settings {
	host: string;
	apiKey: string;
	forwardAddress: string;
	aliasDomain: string;
	generationMethod: GenerationMethod;
}

export async function generateHash(data: string) {
	return Array.from(
		new Uint8Array(
			await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data)),
		),
	)
		.map((bytes) => bytes.toString(16).padStart(2, "0"))
		.join("");
}

export function generateEmail(settings: Settings): string {
	return "";
}
