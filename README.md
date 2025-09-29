# Tasks app

An Android todo list app with notifications feature.

## Get started

Install dependencies

   ```bash
   npm install
   ```

Start the app

   ```bash
   npx expo start
   ```

Create dev build
   ```bash
   eas build --platform android --profile development
   eas build --platform android --local
   ```

Create preview build

   ```bash
   eas build --platform android --profile preview
   ```

or local version (Linux & MacOS only)

   ```bash
   eas build --platform android --profile preview --local
   ```

Create production build:

   ```bash
   eas build --platform android
   ``` 

or local version (Linux & MacOS only)

   ```bash
   eas build --platform android --local
   ```

Cancel a build:

   ```bash
   eas build:cancel
   ```
