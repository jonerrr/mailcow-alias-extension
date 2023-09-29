# Mailcow Alias Generator

A Chrome & Firefox extension for creating aliases using Mailcow's API.

[Chromium-based browsers install](https://chrome.google.com/webstore/detail/mailcow-aliases/iodaelineglpblekpapnngdfoohkaedg) 

[Firefox install](https://addons.mozilla.org/en-US/firefox/addon/mailcow-aliases/)

## Usage

Visit the extension options and complete the initial setup. You can create aliases by right-clicking on any page and selecting "Generate Alias". This will copy the email to your clipboard. In the extension popup, you can then view all your generated aliases (only by this extension).

## Build Requirements

- NodeJS 18.x or later
- pnpm
- A browser that supports Chrome or Firefox extensions

## Build Instructions

1. Clone the repository.
2. Run `pnpm install`.
3. Rename and fill in the `.env.example` with your Firefox extension ID.
4. To build and package run `pnpm build --zip`. The default target is `chrome-mv3` but if you want to build for Firefox, add the argument `--target=firefox-mv2`.
5. For Firefox, go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select the `manifest.json` file in the `build/firefox-mv2-xxxx` folder. For Chrome, go to `chrome://extensions/`, click "Load unpacked", and select the `build/chrome-mv3-xxxx` folder.
