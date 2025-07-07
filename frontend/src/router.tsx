import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { queryClient } from "./configs/query-client";
import { routeTree } from "./configs/routeTree.gen";

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}

export const createRouter = () => {
	const router = routerWithQueryClient(
		createTanstackRouter({
			routeTree,
			context: {
				queryClient,
			},
			scrollRestoration: true,
			defaultPreloadStaleTime: 0,
		}),
		queryClient,
	);

	return router;
};
