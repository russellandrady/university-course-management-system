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
  DialogClose,
} from "@/components/ui/dialog";

interface Column {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchPlaceholder: string;
  onEdit: (row: any) => void;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  editModalTitle: string;
  editFields: { key: string; label: string; type?: string }[];
  onUpdate: (data: any) => void;
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
  editModalTitle,
  editFields,
  onUpdate,
}: DataTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const handleEdit = (row: any) => {
    setEditData(row);
    setModalOpen(true);
    onEdit(row);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editData);
    setModalOpen(false);
    console.log("Updated data:", editData);
    setEditData({});
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditData({});
  };

  return (
    <div className="w-[90%] flex flex-col">
      <div className="flex items-center py-4">
        <Input
          placeholder={searchPlaceholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table className="rounded-xl overflow-hidden bg-background/60 backdrop-blur-md shadow-lg border border-gray-200/60">
        <TableHeader>
          <TableRow className="bg-gray-100/60">
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
            <TableHead className="text-center">Actions</TableHead>
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
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(row)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center">
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

      {/* Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="max-w-md"
          onInteractOutside={handleModalClose}
          onEscapeKeyDown={handleModalClose}
        >
          <DialogHeader>
            <DialogTitle>{editModalTitle}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleModalSubmit} className="space-y-4">
            {editFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1">
                  {field.label}
                </label>
                <input
                  className="w-full border rounded-sm px-2 py-1"
                  type={field.type || "text"}
                  value={editData[field.key] ?? ""}
                  onChange={(e) => handleInputChange(e, field.key)}
                  required
                />
              </div>
            ))}
            <DialogFooter className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="default">
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
