import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { StudentResponse } from "@/types/student/StudentResponse";
import { DashboardManager } from "@/api/services/DashboardService";

export default function Dashboard() {
  const userStore = useUserStore();
  const students = userStore.studentPage?.students ?? [];
  const total = userStore.studentPage?.totalElements ?? 0; // Assume your API returns total count

  // Pagination & search state
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>({});

  const { data: studentsData } = useQuery({
    queryKey: ['students', page, size, debouncedSearch],
    queryFn: () => DashboardManager.fetchStudents({ 
      page, 
      size, 
      search: debouncedSearch 
    })
  });

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(0); // Reset to first page on search
      setDebouncedSearch(searchInput);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchInput]);
  // Modal handlers (unchanged)
  const handleEdit = (row: StudentResponse) => {
    setEditData(row);
    setModalOpen(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditData({ ...editData, [field]: e.target.value });
  };
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ...existing update logic...
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setEditData({});
  };

  // Pagination helpers
  const totalPages = Math.ceil(total / size);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-4rem)]">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-background/30 backdrop-blur-md shadow-2xl border border-gray-200/40 md:min-h-min flex flex-col items-center justify-center gap-4">
        <div className="w-[90%] flex flex-col">
          <div className="flex items-center py-4">
            <Input
              placeholder="Search students..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table className="rounded-xl overflow-hidden bg-background/60 backdrop-blur-md shadow-lg border border-gray-200/60">
            <TableHeader>
              <TableRow className="bg-gray-100/60">
                <TableHead>Name</TableHead>
                <TableHead>Student Id</TableHead>
                <TableHead>Registered Year</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students?.length ? students.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-100/40 transition">
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.registeredYear}</TableCell>
                  <TableCell className="text-center">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No students found.</TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter></TableFooter>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page + 1} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
              disabled={page + 1 >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
        {/* Modal using shadcn/ui Dialog */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent
            className="max-w-md"
            onInteractOutside={handleModalClose}
            onEscapeKeyDown={handleModalClose}
          >
            <DialogHeader>
              <DialogTitle>Update Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="w-full border rounded-sm px-2 py-1"
                  value={editData.name ?? ""}
                  onChange={(e) => handleInputChange(e, "name")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Student Id
                </label>
                <input
                  className="w-full border rounded-sm px-2 py-1"
                  value={editData.studentId ?? ""}
                  onChange={(e) => handleInputChange(e, "studentId")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Registered Year
                </label>
                <input
                  className="w-full border rounded-sm px-2 py-1"
                  value={editData.registeredYear ?? ""}
                  onChange={(e) => handleInputChange(e, "registeredYear")}
                  required
                />
              </div>
              <DialogFooter className="flex justify-end gap-2 pt-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleModalClose}
                    disabled={false}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  variant="default"
                  disabled={false}
                >
                  {"Update"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}