# Mailcow Alias Generator

A Chrome & Firefox extension for creating aliases using mailcow's API.

## Installation

[Chrome Web Store](https://chrome.google.com/webstore/detail/mailcow-aliases/iodaelineglpblekpapnngdfoohkaedg)

[Firefox Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/mailcow-aliases/)

## Usage

Visit the extension options and complete initial setup. You can then use the extension to create aliases by clicking the extension icon.

## Build Requirements

- NodeJS 16.x or later
- pnpm
- A browser that supports Chrome or Firefox extensions

## Build Instructions

1. Clone the repository.
2. Run `pnpm install`.
3. Rename and fill in the `.env.example` with your Firefox extension ID.
4. To build and package for Chrome and Firefox, run `pnpm build`.
5. For Firefox, go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select the `manifest.json` file in the `build/firefox-mv2-xxxx` folder. For Chrome, go to `chrome://extensions/`, click "Load unpacked", and select the `build/chrome-mv3-xxxx` folder.
