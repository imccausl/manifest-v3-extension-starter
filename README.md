# manifest-v3-playground

Template for quickly creating a new manifest v3 browser extension Yarn Modern, React and Vite.

To get started, `yarn dev` to activate `vite --watch`. To build, `yarn build`.

## Notes

- You can remove any entries that you don't need such as content or background and the build system will automatically detect them without needing to make any changes to the vite config (this is because of `entryPlugin` in `infrastructure/plugins`).

- Any assets or other files can be placed in the `public` folder. These will automatically be copied to the build directory by vite during build. Right now this folder houses the `manifest.json` and `popup.html`. Make any necessary changes to these files, and then re-build.
