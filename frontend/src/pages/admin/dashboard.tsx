import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const students = useUserStore().authResponseAdmin?.students;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // Placeholder update mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedRow: any) => {
      // Replace with actual API call
      return new Promise((resolve) =>
        setTimeout(() => resolve(updatedRow), 1000)
      );
    },
    onSuccess: () => {
      setModalOpen(false);
    },
  });

  // Open modal with student data
  const handleEdit = (row: any) => {
    setEditData(row);
    setModalOpen(true);
  };

  // Handle modal form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  // Handle modal form submit
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(editData);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    setEditData({});
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-4rem)]">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-background/30 backdrop-blur-md shadow-2xl border border-gray-200/40 md:min-h-min flex flex-col items-center justify-center gap-4">
        <div className="w-[80%] flex justify-between">
          <Table className="rounded-xl overflow-hidden bg-background/60 backdrop-blur-md shadow-lg border border-gray-200/60">
            <TableCaption className="text-gray-700">
              A list of students
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-100/60">
                <TableHead>Name</TableHead>
                <TableHead>Student Id</TableHead>
                <TableHead>Registered Year</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students?.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-gray-100/40 transition"
                >
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.registeredYear}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter></TableFooter>
          </Table>
        </div>
        {/* Modal using shadcn/ui Dialog */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent
            className="max-w-md"
            onInteractOutside={handleModalClose}
            onEscapeKeyDown={handleModalClose}
          >
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ID</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editData.id ?? ""}
                  onChange={(e) => handleInputChange(e, "id")}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="w-full border rounded px-2 py-1"
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
                  className="w-full border rounded px-2 py-1"
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
                  className="w-full border rounded px-2 py-1"
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
