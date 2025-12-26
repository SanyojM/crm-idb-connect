"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Tabs, Tab, Input, Button, Checkbox, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { BellIcon, MoreVertical, Edit2, Trash2, Check, X } from "lucide-react";
import { useTodoStore, type Todo } from "@/stores/useTodoStore";
import { toast } from "sonner";

type TabKey = "current" | "completed";

export default function DashboardTodo() {
    const { todos, loading, fetchTodos, createTodo, updateTodo, deleteTodo, markComplete, markIncomplete } = useTodoStore();

    const [activeTab, setActiveTab] = useState<TabKey>("current");
    const [newTitle, setNewTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");

    // Delete confirmation dialog
    const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
    const {
        isOpen: isDeleteDialogOpen,
        onOpen: openDeleteDialog,
        onOpenChange: onDeleteDialogChange,
        onClose: closeDeleteDialog,
    } = useDisclosure();

    // Initial data load
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const currentTodos = useMemo(
        () => todos.filter((t) => !t.completed),
        [todos]
    );
    const completedTodos = useMemo(
        () => todos.filter((t) => t.completed),
        [todos]
    );

    const handleCreate = async () => {
        const title = newTitle.trim();
        if (!title || submitting) return;

        try {
            setSubmitting(true);
            await createTodo({ title });
            toast.success("To-do created");
            setNewTitle("");
        } catch (error) {
            console.error("Error creating todo:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleNewInputKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            void handleCreate();
        }
    };

    const handleToggleComplete = async (todo: Todo) => {
        try {
            if (!todo.id) return;

            if (todo.completed) {
                await markIncomplete(todo.id);
                toast.warning("To-do marked as incomplete");
            } else {
                await markComplete(todo.id);
                toast.success("To-do marked as complete");
            }
        } catch (error) {
            console.error("Error toggling todo completion:", error);
        }
    };

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id ?? null);
        setEditingTitle(todo.title);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingTitle("");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;

        const title = editingTitle.trim();
        if (!title) return;

        try {
            await updateTodo(editingId, { title });
            cancelEditing();
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const requestDelete = (todo: Todo) => {
        setTodoToDelete(todo);
        openDeleteDialog();
    };

    const handleConfirmDelete = async () => {
        if (!todoToDelete?.id) {
            closeDeleteDialog();
            return;
        }

        try {
            await deleteTodo(todoToDelete.id);
            toast.success("To-do deleted");
        } catch (error) {
            console.error("Error deleting todo:", error);
        } finally {
            setTodoToDelete(null);
            closeDeleteDialog();
        }
    };

    const renderEmptyState = (message: string) => (
        <div className="border-t mt-6 pt-6 text-center text-sm text-gray-400">
            {message}
        </div>
    );

    const renderTodoRow = (todo: Todo) => {
        const isEditing = editingId === todo.id;

        return (
            <li
                key={todo.id}
                className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-b-0"
            >
                <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox */}
                    <Checkbox
                        isSelected={todo.completed}
                        onValueChange={() => void handleToggleComplete(todo)}
                        aria-label={
                            todo.completed ? "Mark as incomplete" : "Mark as complete"
                        }
                        radius="sm"
                        classNames={{ base: "p-0 m-0" }}
                    />

                    {/* Title / Editing */}
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    size="sm"
                                    radius="sm"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            void handleSaveEdit();
                                        } else if (e.key === "Escape") {
                                            e.preventDefault();
                                            cancelEditing();
                                        }
                                    }}
                                    autoFocus
                                />
                                <Button
                                    isIconOnly
                                    size="sm"
                                    color="primary"
                                    radius="full"
                                    onPress={() => void handleSaveEdit()}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="bordered"
                                    radius="full"
                                    onPress={cancelEditing}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <p
                                className={`truncate text-sm ${todo.completed ? "text-gray-400 line-through" : "text-gray-800"
                                    }`}
                            >
                                {todo.title}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {!isEditing && (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                className="min-w-0"
                            >
                                <MoreVertical className="h-4 w-4 text-gray-500" />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Todo actions"
                            onAction={(key) => {
                                if (key === "edit") startEditing(todo);
                                if (key === "delete") requestDelete(todo);
                            }}
                        >
                            <DropdownItem
                                key="edit"
                                startContent={<Edit2 className="h-4 w-4 text-blue-600" />}
                            >
                                Edit
                            </DropdownItem>
                            <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                startContent={<Trash2 className="h-4 w-4" />}
                            >
                                Delete
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                )}
            </li>
        );
    };

    return (
        <>
            <Card radius="lg" className="shadow-sm border border-gray-200">
                <CardBody className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BellIcon className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">My To do&apos;s</h2>
                    </div>

                    <Tabs
                        aria-label="to-dos tabs"
                        variant="underlined"
                        selectedKey={activeTab}
                        onSelectionChange={(key) => setActiveTab(key as TabKey)}
                    >
                        {/* Current tab */}
                        <Tab key="current" title="Current">
                            <div className="space-y-4">
                                <Input
                                    radius="md"
                                    placeholder="Add a to do...  "
                                    className="mt-2"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    onKeyDown={handleNewInputKeyDown}
                                    isDisabled={submitting}
                                />
                                {loading ? (
                                    <div className="flex justify-center py-6">
                                        <Spinner size="sm" />
                                    </div>
                                ) : currentTodos.length === 0 ? (
                                    renderEmptyState("No To-do's yet.")
                                ) : (
                                    <ul className="mt-2">{currentTodos.map(renderTodoRow)}</ul>
                                )}
                            </div>
                        </Tab>

                        {/* Completed tab */}
                        <Tab key="completed" title="Completed">
                            {loading ? (
                                <div className="flex justify-center py-6">
                                    <Spinner size="sm" />
                                </div>
                            ) : completedTodos.length === 0 ? (
                                renderEmptyState("No completed tasks yet.")
                            ) : (
                                <ul className="pt-2">{completedTodos.map(renderTodoRow)}</ul>
                            )}
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>

            {/* Delete confirmation dialog */}
            <Modal
                isOpen={isDeleteDialogOpen}
                onOpenChange={onDeleteDialogChange}
                placement="center"
            >
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Delete To-do
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete{" "}
                                <span className="font-medium">
                                    &quot;{todoToDelete?.title ?? ""}&quot;
                                </span>
                                ? This action cannot be undone.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="bordered"
                                onPress={closeDeleteDialog}
                                radius="sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                onPress={() => void handleConfirmDelete()}
                                radius="sm"
                                startContent={<Trash2 className="h-4 w-4" />}
                            >
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
};

