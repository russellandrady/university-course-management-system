import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../form";
import { useMutation } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchPlaceholder: string;
  onEdit?: (row: any) => void;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  editModalTitle?: string;
  addModalTitle?: string;
  editFields?: { key: string; label: string; type?: string }[];
  addFields?: { key: string; label: string; type?: string }[];
  onAdd?: (data: any) => void;
  onUpdate?: (data: any) => void;
  formSchema?: z.ZodObject<any>;
  tableTitle?: string;
  onDelete?: (id: number) => void; // Add this line
}

export function DataTable({
  data,
  columns,
  searchPlaceholder,
  onEdit,
  onSearch,
  onPageChange,
  currentPage,
  totalPages,
  editModalTitle = "",
  addModalTitle = "",
  editFields = [],
  addFields = [],
  onAdd,
  onUpdate,
  formSchema,
  tableTitle,
  onDelete,
}: DataTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [currentEditingRow, setCurrentEditingRow] = useState<any>(null);

  const canAdd = !!addFields?.length && !!formSchema && !!onAdd;
  const canEdit = !!editFields?.length && !!formSchema && !!onUpdate;

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      onSearch(searchInput);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchInput, onSearch]);

  // Add Form
  const addForm = useForm({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    mode: "onChange",
  });

  // Edit Form
  const editForm = useForm({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    mode: "onChange",
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      if (onAdd) return await onAdd(data);
    },
    onSuccess: () => {
      setIsAddModalOpen(false);
      addForm.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (onUpdate) return await onUpdate(data);
    },
    onSuccess: () => {
      setIsEditModalOpen(false);
      editForm.reset();
    },
  });

  // Handle add form submission
  const handleAddSubmit = (formData: any) => {
    addMutation.mutate(formData);
  };

  // Handle edit form submission
  const handleEditSubmit = (formData: any) => {
    updateMutation.mutate({
      ...formData,
      id: currentEditingRow?.id, // Include the id from stored row
    });
  };

  // Set edit form values when editing
  const handleEdit = (row: any) => {
    setCurrentEditingRow(row); // Store the current editing row
    editForm.reset(row);
    setIsEditModalOpen(true);
    if (onEdit) onEdit(row);
  };

  return (
    <div className="w-[90%] flex flex-col">
      {tableTitle && <h2 className="text-xl font-light mb-2">{tableTitle}</h2>}
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder={searchPlaceholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-sm"
        />
        {canAdd && (
          <Button onClick={() => setIsAddModalOpen(true)} className="ml-auto">
            Add New
          </Button>
        )}
      </div>
      <Table className="rounded-xl overflow-hidden bg-background/60 backdrop-blur-md shadow-lg border border-gray-200/60">
        <TableHeader>
          <TableRow className="bg-gray-100/60">
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
            { canEdit && (
              <TableHead className="text-center">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? (
            data.map((row, index) => (
              <TableRow
                key={row.id || index}
                className="hover:bg-gray-100/40 transition"
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={
                      column.key === columns[0].key ? "font-medium" : ""
                    }
                  >
                    {column.render
                      ? column.render(row[column.key])
                      : typeof row[column.key] === "boolean"
                      ? row[column.key]
                        ? "True"
                        : "False"
                      : row[column.key]}
                  </TableCell>
                ))}
                {canEdit && (
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(row)}
                    >
                      <SquarePen className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (!canEdit ? 0 : 1)}
                className="text-center"
              >
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage + 1} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange(
              currentPage + 1 < totalPages ? currentPage + 1 : currentPage
            )
          }
          disabled={currentPage + 1 >= totalPages}
        >
          Next
        </Button>
      </div>

      {/* Add Modal */}
      {canAdd && <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New {addModalTitle}</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(handleAddSubmit)}
              className="space-y-4"
            >
              {addFields.map((field) => (
                <FormField
                  key={field.key}
                  control={addForm.control}
                  name={field.key}
                  render={({ field: formField }) => (
                    <FormItem>
                      <label className="block text-sm font-medium mb-1">
                        {field.label}
                      </label>
                      <FormControl>
                        {field.type === "boolean" ? (
                          <select
                            className="w-full border rounded-sm px-2 py-1"
                            {...formField}
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        ) : (
                          <Input
                            type={field.type || "text"}
                            {...formField}
                            autoComplete="new-password"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!addForm.formState.isValid}>
                  Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>}

      {/* Edit Modal */}
      {canEdit && <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {editModalTitle}</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditSubmit)}
              className="space-y-4"
            >
              {editFields.map((field) => (
                <FormField
                  key={field.key}
                  control={editForm.control}
                  name={field.key}
                  render={({ field: formField }) => (
                    <FormItem>
                      <label className="block text-sm font-medium mb-1">
                        {field.label}
                      </label>
                      <FormControl>
                        {field.type == "boolean" ? (
                          <select
                            className="w-full border rounded-sm px-2 py-1"
                            {...formField}
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        ) : (
                          <Input type={field.type || "text"} {...formField} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <DialogFooter>
                <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-2">
                  {/* Left side: Update & Cancel */}
                  <div className="flex gap-2 w-full sm:w-auto justify-start">
                    <Button
                      type="submit"
                      disabled={!editForm.formState.isValid}
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                  {/* Right side: Confirm Delete & Delete */}
                  {onDelete && currentEditingRow?.id && (
                    <div className="flex gap-2 items-center w-full sm:w-auto justify-end mt-2 sm:mt-0">
                      <label className="flex items-center select-none">
                        <input
                          type="checkbox"
                          checked={!!currentEditingRow.confirmDelete}
                          onChange={(e) => {
                            setCurrentEditingRow({
                              ...currentEditingRow,
                              confirmDelete: e.target.checked,
                            });
                          }}
                          className="mr-1"
                        />
                        Confirm Delete
                      </label>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={!currentEditingRow.confirmDelete}
                        onClick={() => {
                          onDelete(currentEditingRow.id);
                          setIsEditModalOpen(false);
                        }}
                        title="Delete"
                      >
                        <span className="mr-2">✔</span> Delete
                      </Button>
                    </div>
                  )}
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>}
    </div>
  );
}
