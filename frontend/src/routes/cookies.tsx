import { $api } from "@/lib/$fetch";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Textarea,
	useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/cookies")({
	component: CookiesComponent,
});

function CookiesComponent() {
	const queryClient = useQueryClient();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const {
		data: cookieStatus,
		isLoading,
		isError,
	} = $api.useQuery("get", "/cookie/status");

	const addCookieMutation = $api.useMutation("post", "/cookie/set", {
		onSuccess: () => {
			queryClient.invalidateQueries($api.queryOptions("get", "/cookie/status"));
			onOpenChange();
		},
	});

	const deleteCookieMutation = $api.useMutation("delete", "/cookie", {
		onSuccess: () => {
			queryClient.invalidateQueries($api.queryOptions("get", "/cookie/status"));
		},
	});

	const [newCookie, setNewCookie] = React.useState({
		user_id: "",
		description: "",
		cookies: "",
	});

	const handleAddCookie = () => {
		addCookieMutation.mutate({
			body: { cookies: newCookie.cookies, platform: "xhs_pc" },
		});
	};

	const handleDeleteCookie = (cookieKey: string) => {
		const [platform, userId] = cookieKey.split(":", 2);
		deleteCookieMutation.mutate({
			params: {
				query: {
					user_id: userId === "default" ? undefined : userId,
					platform,
				},
			},
		});
	};

	const cookies = cookieStatus?.cookies
		? Object.entries(cookieStatus.cookies).map(([key, value]) => ({
				key,
				...value,
			}))
		: [];

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4 text-primary">
				Cookie Management
			</h1>
			<Button onPress={onOpen} color="primary" className="mb-4">
				Add Cookie
			</Button>

			{isLoading && <p>Loading cookies...</p>}
			{isError && <p>Error loading cookies.</p>}

			<Table aria-label="Cookie list">
				<TableHeader>
					<TableColumn>USER ID</TableColumn>
					<TableColumn>PLATFORM</TableColumn>
					<TableColumn>DESCRIPTION</TableColumn>
					<TableColumn>STATUS</TableColumn>
					<TableColumn>CREATED AT</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>
				<TableBody items={cookies}>
					{(item) => (
						<TableRow key={item.key}>
							<TableCell>{item.user_id || "default"}</TableCell>
							<TableCell>{item.platform}</TableCell>
							<TableCell>{item.description}</TableCell>
							<TableCell>{item.status}</TableCell>
							<TableCell>
								{item.created_at
									? new Date(item.created_at).toLocaleString()
									: ""}
							</TableCell>
							<TableCell>
								<Button
									size="sm"
									color="danger"
									onPress={() => handleDeleteCookie(item.key)}
									isLoading={deleteCookieMutation.isPending}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Add New Cookie
							</ModalHeader>
							<ModalBody>
								<Input
									label="User ID (optional)"
									value={newCookie.user_id}
									onChange={(e) =>
										setNewCookie({ ...newCookie, user_id: e.target.value })
									}
								/>
								<Input
									label="Description (optional)"
									value={newCookie.description}
									onChange={(e) =>
										setNewCookie({ ...newCookie, description: e.target.value })
									}
								/>
								<Textarea
									label="Cookie String"
									isRequired
									value={newCookie.cookies}
									onChange={(e) =>
										setNewCookie({ ...newCookie, cookies: e.target.value })
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									color="primary"
									onPress={handleAddCookie}
									isLoading={addCookieMutation.isPending}
								>
									Add Cookie
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
