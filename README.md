# Mailcow Alias Generator

A Chrome & Firefox extension for creating aliases using mailcow's API.

## Installation Requirements

- NodeJS 16.x or later
- pnpm
- A browser that supports Chrome or Firefox extensions

## Installation Instructions

1. Clone the repository.
2. Run `pnpm install`.
3. Rename and fill in the `.env.example` with your Firefox extension ID.
4. To build for Chrome run `pnpm build` or `pnpm build --target=firefox-mv2` for Firefox.
5. For Firefox, go to `about:debugging#/runtime/this-firefox` and click "Load Temporary Add-on" and select the `manifest.json` file in the `build/firefox-mv2-dev` folder. For Chrome, go to `chrome://extensions/` and click "Load unpacked" and select the `build/chrome-mv3-dev` folder.

## Usage

Visit the extension options and complete initial setup. You can then use the extension to create aliases by clicking the extension icon.
