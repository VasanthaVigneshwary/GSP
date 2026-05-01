# User Flows - Gamified Student Event Platform

## Flow 1: Student Discovers and Attends an Event

```
START
  |
  v
[Student Opens App]
  |
  v
[Dashboard Shows Upcoming Events]
  |
  v
[Student Navigates to "Discover" Tab]
  |
  +---> [Search/Filter Events]
  |       |
  |       +---> [By Category]
  |       +---> [By Date]
  |       +---> [By Location]
  |       +---> [By Friends' Attendance]
  |
  v
[Views Event Details]
  |
  +---> [Event Title, Description, Date/Time]
  +---> [Location, Organizer Info]
  +---> [Attendees List, Friend Status]
  +---> [See Other Events from Organizer]
  |
  v
[Interested in Event?]
  |
  +---> NO --> [Back to Discovery]
  |
  +---> YES
        |
        v
    [Click "Register"]
      |
      v
    [Confirm Registration]
      |
      v
    [Event Added to Calendar]
      |
      v
    [Get Reminder Notifications]
      |      |
      |      +---> [24h before]
      |      +---> [1h before]
      |      +---> [Day-of SMS]
      |
      v
    [On Event Day - Student Arrives]
      |
      v
    [Finds QR Code at Venue]
      |
      v
    [Scans QR with Phone Camera]
      |
      v
    [Venue + Time Verified]
      |
      v
    [Attendance Recorded]
      |
      v
    [+20 Points Awarded]
      |
      v
    [Check Badge Achievement]
      |
      +---> [Got New Badge?]
            |
            +---> YES --> [Show Badge Animation]
            |             [Share on Social]
            |
            +---> NO --> [Continue]
      |
      v
    [View Updated Points & Rank]
      |
      v
    [Option to Share Achievement]
      |
      v
END
```

---

## Flow 2: Event Organizer Creates and Manages Event

```
START
  |
  v
[Organizer Opens App/Dashboard]
  |
  v
[Selects "Create Event"]
  |
  v
[Event Details Form]
  |
  +---> [Event Title]
  +---> [Description]
  +---> [Date & Time]
  +---> [Location]
  +---> [Category/Tags]
  +---> [Capacity]
  +---> [Event Image]
  +---> [Accessibility Info]
  |
  v
[Review Event Details]
  |
  v
[System Generates QR Code]
  |
  +---> [Download QR Code]
  +---> [Email QR to Organizer]
  +---> [Print Option]
  |
  v
[Publish Event]
  |
  v
[Event Appears in Catalog]
  |
  v
[Organizer Accesses Promotion Tools]
  |
  +---> [Share on Social Media]
  +---> [Send Email Invites]
  +---> [In-App Notifications]
  +---> [Campus Poster Generate]
  |
  v
[Event Day - 1 Hour Before]
  |
  v
[Organizer Arrives at Venue]
  |
  v
[Opens Check-in Interface]
  |
  v
[Display QR Code or Use Scanning Mode]
  |
  v
[Real-Time Attendance Dashboard]
  |
  +---> [Live Attendance Count]
  +---> [Capacity Status]
  +---> [Arrival Timeline]
  |
  v
[During Event: Students Scan QR]
  |
  v
[Attendance Updates in Real-Time]
  |
  v
[After Event: Access Analytics]
  |
  +---> [Total Attendance vs. Registered]
  +---> [Attendance Timeline]
  +---> [Demographics (if applicable)]
  +---> [Compare to Previous Events]
  |
  v
[Generate Report]
  |
  +---> [Export CSV]
  +---> [Email Report]
  +---> [View on Dashboard]
  |
  v
[Earn Organizer Points]
  |
  +---> [+50 points for hosting]
  +---> [Bonus if high attendance]
  |
  v
END
```

---

## Flow 3: Student Views Leaderboard & Competes

```
START
  |
  v
[Student Opens App]
  |
  v
[Navigates to "Leaderboard" Tab]
  |
  v
[View Global Leaderboard]
  |
  +---> [Top 100 Students by Points]
  +---> [See Own Rank Position]
  +---> [Points Breakdown]
  +---> [Achievements]
  |
  v
[Filter Leaderboard]
  |
  +---> [By Time Period]
  |     +---> [All Time]
  |     +---> [This Semester]
  |     +---> [This Month]
  |     +---> [This Week]
  |
  +---> [By Category]
  |     +---> [Tech Events]
  |     +---> [Sports Events]
  |     +---> [Social Events]
  |     +---> [Cultural Events]
  |
  v
[View Friend Rankings]
  |
  +---> [Select Friends from List]
  +---> [Compare Points Side-by-Side]
  +---> [See Friend Achievements]
  +---> [Challenge Friend]
  |
  v
[Student Sees They're Behind]
  |
  v
[Gets Motivated to Attend More Events]
  |
  v
[Browsed Upcoming Events]
  |
  v
[Registers for More Events]
  |
  v
[Attends Events & Earns Points]
  |
  v
[Rank Improves]
  |
  v
[System Sends Notification: "You Moved Up 5 Places!"]
  |
  v
[Student Shares Achievement on Social]
  |
  v
END
```

---

## Flow 4: Badge/Achievement Earned

```
START
  |
  v
[Student Completes Action]
  |
  +---> [Event Check-in]
  +---> [Attended 10 Events]
  +---> [5+ Week Streak]
  +---> [First 10 at Event]
  +---> [Attended 5 in Category]
  |
  v
[Achievement Unlocked Trigger]
  |
  v
[Badge Earned]
  |
  v
[Full-Screen Animation Shows Badge]
  |
  +---> [Badge Name & Description]
  +---> [Points Earned]
  +---> [Confetti Animation]
  +---> [Encouraging Message]
  |
  v
[Options]
  |
  +---> [View Badge on Profile]
  +---> [Share on Social Media]
  +---> [Continue Using App]
  |
  v
[Badge Displayed on Profile]
  |
  +---> [Visible to Friends]
  +---> [In Leaderboard View]
  +---> [On Achievement Page]
  |
  v
END
```

---

## Flow 5: Notification & Reminder System

```
START
  |
  v
[Student Registers for Event]
  |
  v
[System Sets Up Reminders]
  |
  v
[24 Hours Before Event]
  |
  +---> [Push Notification Sent]
  +---> ["Your event 'Tech Talk' starts tomorrow!"]
  |
  v
[Student Sees Notification]
  |
  +---> [Can Accept/Snooze]
  |
  v
[1 Hour Before Event]
  |
  +---> [Push Notification Sent]
  +---> ["Tech Talk starts in 1 hour! Location: B102"]
  |
  v
[Student Gets Ready to Attend]
  |
  v
[Day Of: Day-Specific Message]
  |
  +---> [SMS or In-App: Location, Time, Special Instructions]
  |
  v
[Student Arrives & Scans QR]
  |
  v
[Immediate Confirmation]
  |
  +---> [Check-in Successful!]
  +---> [+20 Points Awarded]
  +---> [See Updated Rank]
  |
  v
END
```

---

## Flow 6: Error Handling - QR Scan Fails

```
START
  |
  v
[Student Attempts to Scan QR]
  |
  v
[QR Code Not Recognized]
  |
  v
[System Shows Error]
  |
  +---> ["QR Code Not Valid"]
  +---> ["Try Again"]
  +---> ["Or Use PIN Check-in"]
  |
  v
[Student Options]
  |
  +---> [Retry Scan]
  |     |
  |     v
  |     [QR Scan Succeeds]
  |     |
  |     v
  |     [Check-in Successful]
  |
  +---> [Use PIN Check-in]
  |     |
  |     v
  |     [Enter PIN (provided by organizer)]
  |     |
  |     v
  |     [Manual Verification by Organizer]
  |     |
  |     v
  |     [Check-in Approved]
  |
  v
[Points Awarded]
  |
  v
[Attendance Recorded]
  |
  v
END
```

---

## Flow 7: Student Registration & Onboarding

```
START
  |
  v
[New User Downloads App]
  |
  v
[Sign Up Page]
  |
  +---> [Email/Google/Campus ID]
  +---> [Password]
  +---> [Confirm Email]
  |
  v
[Welcome Screen]
  |
  v
[Onboarding Tutorial]
  |
  +---> [Slide 1: "Discover Events"]
  +---> [Slide 2: "Earn Points & Badges"]
  +---> [Slide 3: "Compete on Leaderboards"]
  +---> [Slide 4: "Manage Your Profile"]
  |
  v
[Select Interests]
  |
  +---> [Multiple Category Selection]
  |     +---> [Tech, Sports, Social, Cultural, etc.]
  |
  v
[Set Notification Preferences]
  |
  +---> [Event Reminders]
  +---> [Rank Changes]
  +---> [New Badges]
  +---> [Friend Achievements]
  |
  v
[Create Profile]
  |
  +---> [Profile Picture]
  +---> [Bio]
  +---> [Major/Year (Optional)]
  +---> [Social Links (Optional)]
  |
  v
[Sync with Campus Directory]
  |
  +---> [Optional: Connect Campus ID]
  +---> [Auto-populate Profile Info]
  |
  v
[Dashboard Shown]
  |
  +---> [Recommended Events]
  +---> [Upcoming Registered Events]
  +---> [Current Points & Rank]
  |
  v
[Incentive: "Your first check-in is worth +25 points!"]
  |
  v
END
```

---

## Decision Trees

### Should Event Appear in Discovery?
```
Is Event Published?
├── NO --> Hidden
└── YES
    ├── Is Event Date Valid?
    │   ├── NO (Past Date) --> Archived
    │   └── YES
    │       ├── Does Student Match Filters?
    │       │   ├── NO --> Hidden
    │       │   └── YES
    │       │       ├── Is Event Capacity Full?
    │       │       │   ├── YES --> Show "Waitlist Available"
    │       │       │   └── NO --> Show "Register"
```

### Should Badge Be Awarded?
```
Event Attended?
├── NO --> Don't Award
└── YES
    ├── Check All Badge Conditions
    ├── First 10 Attendees? --> Award "Early Bird"
    ├── Attended 10 Total? --> Award "Social Butterfly"
    ├── 5+ Week Streak? --> Award "Streak Master"
    ├── Category Complete? --> Award "Completionist"
    └── 100+ Points? --> Award "Campus Legend"
```
