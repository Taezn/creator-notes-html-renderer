# Creator Notes HTML Renderer

A Lumiverse Spindle extension that renders HTML and CSS from a character's creator notes as a live preview widget in the character editor.

## What It Does

When you're editing a character in the Identity tab, this extension shows a **float widget** that reads the `creator_notes` field and renders it as real HTML + CSS — images, styled tables, links, embedded stylesheets, all of it.

The preview updates whenever the character data changes.

## Install

1. Open the **Side Panel** (drawer → Extensions)
2. Click **Add Extension** → **Install from Source**
3. Paste the repo URL or point it at this directory via **Import Local**
4. Enable the extension and grant the `characters` and `UI` permissions

## Permissions

| Permission | Why |
|---|---|
| `ui_panels` | Mount the float widget |
| `characters` | Read the active character's creator notes |

## Usage

1. Open any character in the character editor
2. The **HTML Preview** widget appears as a float panel on the right
3. Write HTML + CSS in the creator notes field as normal
4. The widget renders it live

### What's Supported

- Standard HTML5 elements (divs, tables, images, details/summary, audio/video, etc.)
- Inline `<style>` blocks and `style=""` attributes
- Links with safe protocols (http, https, mailto)
- Images from http/https sources and `data:image/*` URIs
- HTML entities and numeric character references

### What's Blocked

The sanitizer strips:
- `<script>` tags and their contents
- `<svg>`, `<math>`, `<noscript>` (namespace-switching and mXSS vectors)
- `<iframe>`, `<embed>`, `<object>`, `<applet>` (embedded content)
- `<base>`, `<link>` (redirect/external-load vectors)
- `<template>` (complex parsing)
- Event handler attributes (`onclick`, `onerror`, etc.)
- `javascript:` and `vbscript:` URLs (in both HTML and CSS)
- `@import` in CSS (loads external stylesheets)
- `expression()`, `behavior:`, `-moz-binding:` in CSS (JS execution vectors)
- `url()` in CSS pointing to non-image data URIs
- Entity-encoded bypasses — all HTML entities are decoded before sanitizing, so `&#60;script&#62;` is caught just like `<script>`

## Security Model

The extension uses **three layers** of defense:

1. **Entity decoding** — All HTML entities (`&#60;`, `&lt;`, `&#x3C;`, named refs) are resolved to their raw characters *before* the sanitizer runs. This prevents the classic "encode the angle brackets" bypass where entity-encoded tags slip through a regex-only filter but get decoded and executed by the browser.

2. **Allowlist sanitizer** — Tags, attributes, and URL protocols are all allowlisted. Unknown or dangerous tags are stripped (not escaped). Attributes are filtered individually. URLs are validated against a protocol allowlist. CSS inside `<style>` tags and `style=""` attributes gets its own sanitization pass.

3. **Sandboxed iframe** — The rendered output goes into `<iframe sandbox="">` with **no sandbox flags** — no scripts, no forms, no same-origin access, no popups, no top-navigation. Even if something slips past the sanitizer, the iframe's sandbox should prevent it from executing scripts, navigating away, or accessing the parent page.

## Architecture

```
src/
  backend.ts     RPC handler to read character creator notes
  frontend.ts    Float widget registration and HTML rendering
  sanitizer.ts   Three-layer sanitizer (entity decode → tag/attr filter → CSS sanitize)
```

## Development

```bash
bun install
bun run build    # compiles backend.ts + frontend.ts → dist/
```

Then install the extension via the Spindle Panel using **Import Local**, pointing at this directory.

See the [Spindle developer docs](https://docs.lumiverse.chat) for the full API reference.
