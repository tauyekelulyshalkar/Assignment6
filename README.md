# Assignment 6 - jQuery: Selectors, Effects and Animations

A complete starter implementation for the two tasks in the supplied Assignment 6 PDF.

## Run the project

1. Download or clone this folder.
2. Open `index.html` in Chrome, Edge or Firefox.
3. The jQuery library is included locally in `js/jquery-3.6.1.min.js`, so the page behaviour does not depend on a CDN.
4. The Open Peeps avatars are loaded from DiceBear. An internet connection is needed for those remote avatar images.

You can also publish the whole folder as a GitHub repository and enable GitHub Pages from the repository settings.

## Project structure

```text
assignment6_jquery_project/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── jquery-3.6.1.min.js
└── docs/
    └── report_prompt.txt
```

## What is implemented

### Task 1 - Selector Detective

- The four rooms and all 20 original guests are stored in a JavaScript array.
- The page is generated from that array with jQuery.
- Every guest card includes an Open Peeps avatar, clothing-colour ring, name, arrival time, belongings and an AITU badge when applicable.
- Guest details are also stored in `class` names and `data-*` attributes.
- All 20 case buttons are implemented with jQuery selectors and traversal methods. Cases 18 and 19 use `fadeIn()` and `fadeOut()`.
- In **Task 1 · Rebuild** mode, the party is rebuilt from the original array before each case.

### Task 2 - The party in motion

- **Spotlight:** other guests fade to 20%; Clear restores them.
- **Guest card:** click a guest to open the animated information panel. Press Esc or click outside to close it.
- **Move:** use the room buttons in the guest panel to move a guest. The card flies to the new room and the old/new spaces animate. The data array is updated.
- **Sort by time:** each room toggles between arrival-time order and its current picture order.
- **Fast clicks:** jQuery animations use `.stop()` before starting a new animation to prevent long animation queues.
- In **Task 2 · Live house** mode, case buttons search the current DOM. This makes it possible to verify that moving a guest changes the result of a case.

## Important notes

- The supplied picture shows 20 guests. The initial data in `js/app.js` was transcribed from that image.
- The cake-thief case identifies **Zarina** from the listed clues.
- The assignment requires an individual solution and a live defence. Review the code, change the design if needed, and make sure you can explain every selector and animation.
- The report is not included as a completed report because it must contain your own screenshots and explanations. Use `docs/report_prompt.txt` as a separate prompt after capturing the real browser screenshots.

## Suggested GitHub repository name

`assignment-6-jquery-party`
