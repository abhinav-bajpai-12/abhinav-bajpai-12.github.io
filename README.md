# Abhinav Bajpai Portfolio V2
Resume intentionally removed from the public site.
V2 includes a recruiter-focused hero, 9+ years profile, expanded technical stack, career timeline, selected projects, Cloud & DevOps roadmap, education/CCNA, contact links, responsive navigation, animations and SEO metadata.
The hero features a split illustration: infrastructure engineer by day (servers and PowerShell), gamer by night (PC and controller with player ID Loststarx3). Its decorative animations respect reduced-motion preferences.
Motion includes a floating server rack, staggered status lights, flowing network dashes, terminal typing, rotating day/night details, spinning PC fans and a rocking controller.
Buttons inside each illustration panel open the Infrastructure Quiz or a random arcade game (Snake, Memory Match or Reaction Time). Visitors can also select a specific game; another random choice excludes the current game. The clock cursor is hidden while hovering over the illustration or games. Snake pauses when closed, offscreen, switched away from, or the browser loses focus. Reaction rounds cancel on close, game changes, loss of focus or when offscreen. All activities run locally without network requests, storage or real server access.

The quiz starts with 30 original questions across Windows Server, VMware, PowerShell, networking, operations, monitoring, security and messaging. `quiz-data.js` contains question text, correct answer, three distractors, topic and explanation. Rounds use up to 10 shuffled questions without repeats, optionally filtered by topic. Answer options are shuffled, with immediate feedback and scoring. Add independently verified, appropriately licensed questions to that array to expand the bank; the displayed total comes from the actual data, not generated variants.

Publish repository: `abhinav-bajpai-12.github.io`
GitHub Pages: Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
Keep employer names out of the public lab examples and fictional infrastructure diagram. Employer names may appear in the professional profile and work experience. Do not publish confidential server names, IPs, screenshots, credentials or internal architecture.

The desktop clock cursor uses [cursor-effects by Tim Holman](https://github.com/tholman/cursor-effects) v1.0.18 (MIT), stored locally in `vendor/cursor-effects-1.0.18.js`. Its date and clock hands use the visitor's local time. It is disabled for touch devices and reduced-motion preferences.

## Professional content and controls

- The Quick Overview summarizes only the existing role, skills, experience and target opportunities.
- How I Solve Problems expands existing experience into three approach-focused summaries. The 30%+ automation figure is carried over from the existing portfolio, not newly verified. Other outcomes are deliberately qualitative. Representative workflows are labeled; they are not employer incident reports or undisclosed production case studies. Replace with approved, verifiable project details when available.
- The PowerShell Lab offers three original, local, read-only Windows scripts in `examples/`, with matching source previews and explicitly illustrative JSON output in `lab-data.js`. No script is executed by the website. Review code and test in an authorized lab; CIM/service/hotfix access depends on the environment and permissions. `Get-HotFix` is not a complete update inventory or compliance check.
- Inside an Infrastructure is a fictional component explorer, not an employer architecture. Its seven buttons explain component roles, dependencies and investigation ideas. The numbered layers are conceptual relationships, not a packet-flow diagram.
- Effects: On/Off controls decorative motion, typing, reveals, smooth scrolling and clock visibility for the current page visit. OS reduced-motion preferences take precedence. The clock library is initialized once when needed and its layer is hidden when effects are off; games remain opt-in and playable.
- Accessibility improvements include a skip link, a main landmark, keyboard-operable experience accordions with expanded states, navigation states and Escape handling, visible focus outlines, hidden-email focus protection and larger touch controls. The animated role has a static screen-reader alternative.

The site remains a static GitHub Pages site with no backend, analytics or additional package/build requirements. Open `index.html` for a local preview. Keep the `examples/`, `vendor/`, `lab-data.js` and `quiz-data.js` files alongside the site when publishing. After editing downloadable scripts, update their source previews in `lab-data.js` to match.
