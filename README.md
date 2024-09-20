# Alima NextJS Monorepo

NextJS Monorepo (implemented in Turborepo), to manage front-end ecommerce solutions for Suppliers.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `insumosya`:  Insumos Ya - is the B2B price comparison platform developed by Alima.
- `commerce-template`: B2B ecommerce template to build stores for Suppliers
- `ui`: a stub React component library shared by both all `apps/*` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Adding a new Custom Ecommerce Workspace

```sh
# Run this command
pnpm turbo gen workspace --copy commerce-template

# Define from the prompt:
# - name of the project
# - location
# - dependencies & devDependencies
```

Once created, go to its correspondent **README.md** file to setup respective env vars and run it.

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd alima-nextjs-monorepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd alima-nextjs-monorepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd alima-nextjs-monorepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
# npx turbo unlink  # to disbale Remote Caching
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
