# Team 12 - CS 307 Product Backlog

## Project Name: Capsule

**Team Members:** Nathan Schneider, Kevin Jones, Evan Zimmerman, PJ Henwood

### Problem Statement

Our project is a time capsule mobile application designed to help users reminisce on the positive aspects of their month. Capsule automates the process of creating a monthly snapshot, including pictures, music, and more, allowing users to be surprised with a captivating, personalized visual and acoustic masterpiece at the end of each month.

### Background Information:

#### Audience

The target audience includes teenagers and young adults with a fast-paced lifestyle, as well as older generations looking for a simple, user-friendly application to easily obtain engaging, personal capsules.

#### Similar Platforms

While Google Photos, Apple Photos, Snapchat, and Spotify provide recaps, they are limited to their own apps. Capsule aims to combine these recaps into an all-encompassing time capsule, with a focus on easy sharing.

#### Limitations

Other apps often require users to create their own monthly snapshots. Capsule stands out by automating this process and creating a single, comprehensive snapshot. Additionally, Capsule provides better sharing options compared to existing platforms.

### Functional Requirements

#### Login/Sign up

- Log in/sign up via Google account for a faster process.
- Create a username during registration for identification.
- Pick a profile picture during registration for better identification.
- Option to link/not link Spotify and Instagram accounts during registration.
- Ability to delete the account.

#### Profile, Friends, and History

- Unique profile page for each user.
- Toggle between light and dark mode.
- Link/unlink Spotify, Instagram, and change profile picture on the 'my profile' page.
- Friends page for quick access to friend-related actions.
- Invite friends by username.
- View friend requests.
- Accept or reject friend requests.
- Remove accepted friends.
- History page for past capsules.
- Click on a snapshot to enlarge it.
- Share snapshot as an image to another app.
- Edit snapshot.

#### Storyboard (Sharing Snapshots)

- Storyboard page to view friends' snapshots.
- Comment and react on friends' snapshots.
- Reset storyboard every month.

#### Main Page

- Countdown until the monthly snapshot release.
- View snapshot at the end of the month.
- Snapshot includes most played song of the month.
- Portion of the snapshot's song plays out loud.
- Intelligent photo selection for the snapshot.
- Use Instagram photos in the snapshot.
- No identical pictures in the snapshot.
- Default photos/songs if user data is insufficient.
- Variable amount of photos in the snapshot.
- Snapshot includes a quote from the song.
- Share snapshot to the storyboard.

#### Editing

- Edit page with all snapshot editing features.
- Change photo, song, and quote.
- Adjust the number of photos used.
- Save edited snapshot.

#### Yearly Recap (Moments)

- Insert brief descriptions of moments.
- Track the number of entered moments.
- Receive all moments at the end of the year.
- Timestamp for each user moment.

#### Notifications

- Receive a notification when the monthly snapshot is released.
- Receive notifications for friend requests, reactions, comments, and shared snapshots.

### Non-Functional Requirements

#### Architecture

- Separate frontend and backend.
- Frontend: JavaScript using React Native.
- Backend: Node.js server on AWS EC2.
- Database: MongoDB.

#### Security

- Google's authentication services for login data.
- API calls for information access, requiring authentication.

#### Usability

- Intuitive interface for a wide range of users.
- Focus on simplicity after initial setup.
- Modern stack for smooth performance.

#### Hosting/Deployment

- Backend hosted on AWS EC2.
- Frontend deployment on Expo Go for testing.
- Explore other options for public deployment (e.g., GitHub pages or Netlify).

