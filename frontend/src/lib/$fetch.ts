import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./api";

const client = createFetchClient<paths>({
  baseUrl: "http://localhost:8000",
});

export const $api = createClient(client);
