# kAIbigan Mobile Demo Checklist

## Run

- `npm run dev`
- `npm test`
- `npm run build`

## Golden Path

- Splash to Welcome to Anonymous Sign-in
- Anonymous sign-in to Intake Triage to Triage Result
- Triage Result to Coach or Psychiatrist booking
- Home to AI Chat, including Red Flag modal trigger
- Home to Mood Check to Mood Calendar
- Home to Explore to Resource Detail
- Profile language toggle and demo sign-out

## Review Checklist

- `index.html` title is `kAIbigan`
- Anonymous alias and school persist after refresh
- Intake saves score, answers, and red-flag status
- SOS button, intake Q5, and self-harm chat keywords all open the Red Flag modal
- Chat accepts Enter and send-button submission
- Coach and psychiatrist bookings end on confirmation screens
- Mood logs appear in the calendar after refresh
- EN/FIL toggle updates the demo-critical strings
- No console errors during the 3-minute walkthrough
