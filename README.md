# Another Tasks App

An Android todo list app with notifications feature. Built using Expo/React Native. Works offline, no authentication needed. Main features include:
- Creating/editing/deleting tasks for any days;
- Setting reminder notifications for tasks;
- Each task has its own editable priority that dictates its placement on the tasks list;
- Customization: choose theme, font size and app language.

## Get started

### Install dependencies

   ```bash
   npm install
   ```

### Start the app

   ```bash
   npx expo start
   ```

### Create dev build
   ```bash
   eas build --platform android --profile development
   eas build --platform android --local
   ```

### Create preview build (production build for personal use, not app stores):
1. Check for the project for issues:
```bash
npx expo-doctor@latest
```

2. Create the build:
```bash
npm run preview
```

or local version (Linux & MacOS only)
   ```bash
   eas build --platform android --profile preview --local
   ```

### Create production build (for app stores):
   ```bash
   eas build --platform android
   ``` 

or local version (Linux & MacOS only)
   ```bash
   eas build --platform android --local
   ```

### To cancel an ongoing build, run:
   ```bash
   eas build:cancel
   ```
