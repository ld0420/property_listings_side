# Introduction

Hi there 👋,

Thanks for taking the time to complete this brief take-home assignment. _Please
timebox your effort to a maximum of 3 hours._

The goal of this exercise is to evaluate your frontend skills (React, styling,
accessibility, responsive, 3rd-party integration, testing, and more). Feel free
to make any assumptions, simplifications, or other changes to the problems -
**though please state those in your write up (README.md) when you submit this
assignment**. Please use as many libraries as is reasonable, however, please
state your reasoning for such a library so we better understand your thought
process.

The objective of this assignment is to build a simple React application
implementing a property list view using data returned from the SimplyRETS API
and matching the following [Figma design
mockup](https://www.figma.com/design/FXPBY3hFfCfl8ZM8SmrbLV/Eng-Take-Home-Test). pw: `angle-fly-cloth-decaf`
SimplyRETS is an API commonly used in real estate and you will need to use it to
retrieve the properties data.

Before getting started, please read this document carefully.

**Good luck 🙃**

# Acceptance criteria

- Create the following page: Property Listings
  - NOTE: This page should be built with the consideration that other pages
    would eventually be added. Not looking for any over-engineering here, simply
    an understanding of how you would structure your application given that bit
    of context.
- Implement the following design:
  - A global sticky header containing the page name
  - A panel on the left that displays a map
  - A panel on the right that displays a list of the property listings available within the map area
    - Output the data from the SimplyRETS API into the list view of properties. Each
      property should at least display the following information:
      - `bedrooms`
      - `bathsFull` + `bathsHalf` (ex: 1 full + 3 half = 2.5)
      - `area` (as Sq Ft)
      - `listPrice`
      - `address`
      - `listDate` (MM/DD/YY)
      - `photo[0]`
      - Favorite state: White outlined heart if not favorited, red heart if
        favorited. _(Heart SVG assets included.)_
    - If the map area changes (zoom, move, etc), the list of property listings should update
  - Use style definitions from Figma when possible
  - Desktop and Mobile screen sizes are provided. All screen widths from 375 to
    1680 should be supported. Intermediate responsive behavior should be
    inferred.
- Get data from the SimplyRETS property endpoint on Property Listings page load
  - cache in local storage
- On the Property Listings page, the user can click the heart to save the mlsId
  associated. Store the saved/favorited properties in the browser local storage.
- Add any tests to satisfy confidence in your application. _Be sure to document
  the types of tests you choose and why_
- Styles can be handled in any manner you choose – i.e. sass, css, emotion,
  etc...
- This application is expected to be built utilizing current patterns and best
  practices of React (i.e. hooks). _Please do not use any other 3rd-party state
  management libraries such as Redux or Mobx._
- Explain any design decisions (_including items left out due to time
  constraints_) in the README.md file

# What you will be assessed on

- All functional requirements must be satisfied
- The application successfully builds
- The application successfully runs with no console errors or warnings
- Production-like code that must be well coded, clean, and commented
- UI must be responsive and clean
- UI should closely match the mockup.
- Intermediate screen width behavior should be reasonable.
- General understanding of semantic markup and accessibility
- Tests must be passing and meaningful
- General React knowledge

# Submission

Once you are satisfied with your assignment, please publish your code and README
to your personal Git repository and send the repository link to the email our recruiter has
provided. Please _do not_ create a fork or PR in the assignment repository.

## AI Tool Usage Policy

**You are welcome and encouraged to use AI tools** (GitHub Copilot, Claude, ChatGPT, Cursor, or any other) during this assignment. We use AI tools daily on this team and we're interested in how you work with them, not whether you avoid them.

However, we ask for full transparency in your submission:

1. **Commit any agent or skill files you created.** If you used Claude Code with custom agents (`.claude/agents/*.md`) or skills (`.claude/skills/*/SKILL.md`) to scaffold, review, or guide your work, commit those files in your repository. If you used a different tool with a similar concept (Cursor rules, Copilot instructions, etc.), include those as well.

2. **Add an `AI_USAGE.md` file** at the root of your repository describing:
   - Which AI tools you used and for what purpose (e.g., "used Claude to generate the initial schema, reviewed and adjusted the index choices manually")
   - Any suggestions you accepted as-is vs. modified
   - Any suggestions you rejected and why
   - Anything the AI got wrong that you had to correct

There is no right or wrong answer here. Using AI extensively is fine. Using no AI is fine. What we're evaluating is your judgment — whether you understand and can defend the code you're submitting, and whether you can identify when AI output needs correction. We will ask about your AI_USAGE.md directly in the technical deep-dive.

# Getting Started

With Node 20.9.0 or newer installed (Node 24 LTS recommended; see `.nvmrc`), run the following commands:

```sh
yarn && yarn dev
```

Navigate to `http://localhost:3000/`.

## Maps

You may choose any map provider you wish, but for convenience we have bundled [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api).

Google Maps requires an API key. You may use `AIzaSyCqxqAPlybcdfWGj5SX5kIDG7CmLtPiR58`, which is restricted to localhost.

## What will you find inside this boilerplate

In this boilerplate, you will find:

- A standard [NextJS App](https://nextjs.org/) with some
  provided assets (favorite SVG icons & fonts)
- A `README.md` file to document your comments and design decisions
- Inside the `package.json`, in addition to NextJS dependencies, we've added the
  following packages:
  - `prettier`: simple code formating
  - `@react-google-maps/api`: for rendering google maps

## Design Mockup

For the mockup, use [this Figma
design](https://www.figma.com/design/FXPBY3hFfCfl8ZM8SmrbLV/Eng-Take-Home-Test).
Both desktop & mobile are included.

The file is password-protected (read-only access for this take-home):
`angle-fly-cloth-decaf`

The favorite heart icons are already provided as SVGs in the `/public`
directory. The font used in the mockup, Open Sans, is already included in the app globally.

## SimplyRETS API

SimplyRETS is a platform for developers and agents to build real estate
applications and websites.

Their API uses Basic Authentication, which most HTTP libraries will handle for
you. To use the test data, you can use the api key `simplyrets` and secret
`simplyrets`. Note that these test listings are not live RETS listings but the
data, query parameters, and response bodies will all work the same.

Please use the following endpoint: https://api.simplyrets.com/properties. More
information can found in the [SimplyRETS
documentation](https://docs.simplyrets.com/api/index.html#/Listings/get_properties).

Note: if you use `next/image` to render listing photos, the boilerplate's
[`next.config.js`](next.config.js) already whitelists the SimplyRETS trial
photo host (`*.cloudfront.net`). If you point at a different image host,
extend `images.remotePatterns` accordingly.
