import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardFooter,
	Image,
	Spinner,
	Tab,
	Tabs,
} from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { $api } from "../lib/$fetch";
import type { operations } from "../lib/api";

type HomefeedResponse =
	operations["get_homefeed_recommend_xhs_homefeed_recommend_get"]["responses"]["200"]["content"]["application/json"];

export const Route = createFileRoute("/homefeeds")({
	component: HomefeedsComponent,
	loader: async ({ context: { queryClient } }) => {
		const data = await queryClient.ensureQueryData(
			$api.queryOptions("get", "/xhs/homefeed/category"),
		);
		return [{ id: "all", name: "推荐" }, ...data.categories];
	},
});

function HomefeedsComponent() {
	const categoriesData = Route.useLoaderData();
	const [selectedCategory, setSelectedCategory] = React.useState(
		categoriesData[0]?.id,
	);

	const {
		data: notesData,
		fetchNextPage,
		hasNextPage,
		isLoading: isLoadingNotes,
		isFetchingNextPage,
	} = $api.useInfiniteQuery(
		"get",
		"/xhs/homefeed/recommend",
		{
			params: {
				query: {
					category: selectedCategory,
				},
			},
		},
		{
			initialPageParam: "",
			getNextPageParam: (lastPage: HomefeedResponse) => lastPage.cursor_score,
		},
	);

	const allNotes = notesData?.pages.flatMap((page) => page.items || []);

	return (
		<div className="p-4 flex flex-col gap-4">
			<h1 className="text-2xl font-bold mb-4">Homefeeds</h1>

			<Tabs
				aria-label="Categories"
				selectedKey={selectedCategory}
				onSelectionChange={(key) => setSelectedCategory(key as string)}
			>
				{categoriesData.map((category) => (
					<Tab key={category.id} title={category.name} />
				))}
			</Tabs>

			{isLoadingNotes && <Spinner label="Loading notes..." />}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
				{allNotes?.map((item) => (
					<Card key={item.id} shadow="sm" isPressable>
						<CardBody className="overflow-visible p-0">
							<Image
								shadow="sm"
								radius="lg"
								width="100%"
								alt={item.note_card.display_title}
								className="w-full object-cover h-[200px]"
								src={item.note_card.cover.url_pre}
							/>
						</CardBody>
						<CardFooter className="text-small justify-between">
							<b>{item.note_card.display_title}</b>
							<div className="flex items-center">
								<Avatar
									src={item.note_card.user.avatar}
									size="sm"
									className="mr-2"
								/>
								<span>{item.note_card.user.nick_name}</span>
							</div>
						</CardFooter>
					</Card>
				))}
			</div>

			{hasNextPage && (
				<div className="flex justify-center mt-4">
					<Button onPress={() => fetchNextPage()} disabled={isFetchingNextPage}>
						{isFetchingNextPage ? "Loading..." : "Load More"}
					</Button>
				</div>
			)}
		</div>
	);
}
