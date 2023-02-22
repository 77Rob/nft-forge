# NFT Forge

# Welcome to the world of generative NFT collections! Bring your NFT vision to life with a tool that makes it easy to generate art for and create NFT collections.

In this project, images in a generative NFT collection are constructed from different traits that can be combined and blended to create unique, one-of-a-kind NFTs. Think of it as building an NFT from the ground up, piece by piece. For example, a cryptopunk picture might be a combination of 5 different image layers, such as a hat, cigar, body, glasses, beard, and earrings.

![CryptoPunk](./public/cryptopunk.png)

With this project, you can use the API to create and manage your own NFT collections. You can create new collections and add, update, or delete image layers to build the appearance of your NFT. Once you're happy with your creation, you can upload the images and metadata to IPFS to ensure that your NFT is securely stored in a decentralized manner. Finally, you can deploy a smart contract that represents your NFT and makes it tradeable and collectible.

In addition to the API, the project also provides a user-friendly interface that makes it easy to create and manage NFT collections. With a simple, intuitive interface, you can preview your generated art, add, update, or delete image layers, upload images and metadata to IPFS, and deploy smart contracts with just a few clicks.

Whether you're a seasoned blockchain developer or just starting out, the user interface makes it easy to get started with NFTs and experience the excitement of creating unique, collectible digital assets. So go ahead and try it out, and see what kind of amazing NFT collections you can create!

# This project also gives the ability to deploy NFT (non-fungible token) smart contracts using the images that are provided by the user. With this feature, users can create unique and valuable digital assets that are stored securely on the blockchain

To get started, users simply need to upload their desired images to IPFS (InterPlanetary File System), a decentralized storage network that allows for fast and reliable file sharing. Once the images are uploaded, users can then use the platform to create and deploy their own NFT smart contracts.

# Folder Structure Of Collections When Saved Locally

```
[user_id] - A unique identifier for each user
    -user.json - A user configuration Web3.Storage and Pinata api keys are stored here
    -collections - A folder that stores all the collections created by the user
        -[collection_name] - A subfolder that represents a specific collection
            -config.json - A JSON file that specifies the settings and parameters of the collection
            -metaData - A folder that contains generated metadata files for the items in the collection
            -generated - A folder that contains the final images generated by the collection
            -layers - A folder that contains the different layers of the collection
                -[layer_name] - A subfolder that contains the images for each layer of the collection
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# Build using

- NextJS
- Redux
- TailwindCSS
- DaisyUI
- Ethers

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
