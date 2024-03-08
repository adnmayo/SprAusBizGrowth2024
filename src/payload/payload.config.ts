import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import dotenv from "dotenv";
import path from "path";
import { buildConfig } from "payload/config";
import { Icons } from "../components/Icons";
import ReturnToSite from "../components/admin/ReturnToSite";
import { getUrl } from "../lib/utils/getUrl";
import Users from "../payload/collections/Users";

const mockModulePath = path.resolve(__dirname, "./emptyModuleMock.js");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// TODO: CUSTOMISE PAYLOAD MORE!
export default buildConfig({
  serverURL: getUrl(),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),

  editor: slateEditor({}),
  admin: {
    user: Users.slug,
    meta: {
      favicon: "/icon.png",
      ogImage: "/icon.png",
      titleSuffix: "• SME@UTS Admin",
    },
    components: {
      graphics: {
        Icon: Icons.payloadIcon,
        Logo: Icons.payloadLogo,
      },
      actions: [ReturnToSite],
    },
    bundler: webpackBundler(),
    webpack: (config) => {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve?.alias,
            fs: mockModulePath,
          },
        },
      };
    },
  },
  collections: [Users],
  globals: [
    // Your globals here
  ],
  defaultDepth: 0,
  rateLimit: {
    max: parseInt(process.env.PAYLOAD_MAX_RATE_LIMIT ?? "500"),
  },
  typescript: {
    outputFile: path.resolve(__dirname, "../payload-types.ts"),
  },
  graphQL: {
    disable: true,
  },
  cors: [getUrl()].filter(Boolean),
  csrf: [getUrl()].filter(Boolean),
});
