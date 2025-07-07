import type { components } from "@/lib/api";
import { addToast } from "@heroui/react";
import {
	MutationCache,
	QueryClient,
	type QueryFilters,
} from "@tanstack/react-query";

interface MutationMeta extends Record<string, unknown> {
	deps?: QueryFilters;
	successMessage?: string;
	errorMessage?: string;
}

declare module "@tanstack/react-query" {
	interface Register {
		// TODO: global error handler
		defaultError: components["schemas"]["ErrorResponse"];
		mutationMeta: MutationMeta;
	}
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
	mutationCache: new MutationCache({
		onSettled: (_data, _error, _variables, _context, mutation) => {
			if (mutation.meta?.deps) {
				queryClient.invalidateQueries(mutation.meta.deps);
			}
		},
		onError: (_error, _variables, _context, mutation) => {
			if (mutation.meta?.errorMessage) {
				addToast({
					title: mutation.meta.errorMessage,
					color: "danger",
				});
			}
		},
		onSuccess: (_data, _variables, _context, mutation) => {
			if (mutation.meta?.successMessage) {
				addToast({
					title: mutation.meta.successMessage,
					color: "success",
				});
			}
		},
	}),
});
