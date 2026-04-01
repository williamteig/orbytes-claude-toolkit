# /task — orbytes Dev Pipeline Task Manager

The user has run: `/task $ARGUMENTS`

You are working with the orbytes Dev Pipeline in Notion.

**Dev Pipeline Database ID:** `599e132701274298b902d85a529ebde5`
**Data Source:** `collection://277efdcf-8436-4503-84a6-20f3e9428ef7`

## Determine the intent

Look at `$ARGUMENTS` and determine which mode to use:

### Mode A: Execute an existing task (argument is a number)

If `$ARGUMENTS` is a number (e.g., `13`), this is a task ID. Do the following:

1. **Fetch the task** — Query the Dev Pipeline data source for the task where `userDefined:ID` equals the number:
   ```
   SELECT * FROM "collection://277efdcf-8436-4503-84a6-20f3e9428ef7" WHERE "userDefined:ID" = <number>
   ```

2. **Read the task page** — Use `notion-fetch` on the task's URL to read the full page content, including any sub-content, checklists, or notes inside it.

3. **Understand what's being asked** — The task title + notes + page content describe what needs to be done. Interpret the task in the context of the orbytes workflow:   - If it's a **Feature** or **Bug** — this likely involves writing or modifying code
   - If it's **Research** — investigate and write up findings
   - If it's **Docs** — write or update documentation
   - If it's **Chore** — infrastructure, cleanup, or process work

4. **Execute the task** — Do the work. Use all tools available to you (file editing, code execution, web search, Notion, Figma, Webflow MCPs as needed). Be thorough.

5. **Write findings back to Notion** — Update the task's Notion page with your deliverables:
   - Use `notion-update-page` to write your findings, output, or summary into the page content
   - Be structured: use headings, bullet points, code blocks as appropriate
   - If you created files, mention their paths and purpose
   - Include any relevant links, screenshots, or references

6. **Update task status** — Move the task to the appropriate status:
   - If fully complete → set Status to "Done"
   - If blocked or needs review → keep as "In progress" and add a note explaining what's needed
   - Update any other relevant properties (Branch if you created one, Notes if needed)

7. **Report back** — Give the user a concise summary of what you did and what's now in the Notion page.

### Mode B: Create a new task (argument is a description)

If `$ARGUMENTS` is text (not a number), this is a new task description. Do the following:

1. **Parse the description** — Extract the task intent from the text.
2. **Ask clarifying questions** — Use interactive prompts to confirm details:
   - **Project**: Which project is this for? (TAT Website / TAT Connector / Orbytes / Personal)
   - **Type**: What kind of task? (Feature / Bug / Chore / Research / Docs)
   - **Priority**: How urgent? (Critical / High / Medium / Low)
   - Optionally ask about Phase and Due date if not obvious

3. **Create the task** — Use `notion-create-pages` to create a new page in the Dev Pipeline database with:
   - Task (title): the task description, cleaned up into a clear title
   - Project: selected project
   - Type: selected type
   - Priority: selected priority
   - Status: "Not started"
   - Notes: any additional context from the user's description
   - Phase: if provided
   - Due: if provided

4. **Confirm** — Show the user the created task with its auto-assigned ID and a link to the Notion page. Ask if they want to start working on it immediately (which would trigger Mode A behaviour).

## Important context

- The Dev Pipeline is shared across all orbytes projects. The `Project` field determines which project a task belongs to.
- Each client project in the Orbytes Clients database can have a filtered view of this pipeline showing only their tasks.
- Task IDs are auto-incremented — you never set them manually.
- Always read the full task page content before executing, not just the database row properties.