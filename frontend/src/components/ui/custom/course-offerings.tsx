import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { DashboardManager } from "@/api/services/DashboardService";
import { DataTable } from "./dataTable";
import { z } from "zod";
import { ref } from "process";
import { useTokenStore } from "@/store/tokenStore";

const offeringColumns = [
  { key: "studentId", label: "Student ID" },
  { key: "courseName", label: "Course" },
  { key: "courseId", label: "Course ID" },
  { key: "offeredYear", label: "Year" },
  { key: "result", label: "Result" },
];

const offeringEditFields = [{ key: "result", label: "Result" }];

const offeringAddFields = [
  { key: "studentId", label: "Student ID" },
  { key: "courseId", label: "Course ID" },
  { key: "offeredYear", label: "Year" },
];

const formSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
  offeredYear: z.coerce.number().min(1900, "Offered Year must be valid"),
  result: z.coerce.number().min(1, "Result is required").max(100, "Result cannot exceed 100").optional(),
});

export function CourseOfferings() {
  const userStore = useUserStore();
  const offerings = userStore.courseOfferingsPage?.courseOfferings ?? [];
  const totalPages = userStore.courseOfferingsPage?.totalPages ?? 0;

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userTypedSomething, setUserTypedSomething] = useState(false);

  const token = useTokenStore((state) => state.token);

  const { refetch } = useQuery({
    queryKey: ["courseOfferings", page, size, debouncedSearch],
    queryFn: () =>
      DashboardManager.fetchCourseOfferings({
        page,
        size,
        search: debouncedSearch,
      }).then(() => setUserTypedSomething(true)),
    enabled: !!token && (!userStore.courseOfferingsPage || page !== 0),
  });

  const handleEdit = (row: any) => {
    // Handle edit logic here
  };

  const handleSearch = (search: string) => {
    setPage(0);
    setDebouncedSearch(search);
  };

  useEffect(() => {
    if (debouncedSearch === "" && !userTypedSomething) {
      return;
    }
    refetch();
  }, [debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <DataTable
      data={offerings}
      columns={offeringColumns}
      searchPlaceholder="Search offerings..."
      onEdit={handleEdit}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      currentPage={page}
      totalPages={totalPages}
      editModalTitle="Update Course Offering"
      addModalTitle="Course Offering"
      editFields={offeringEditFields}
      addFields={offeringAddFields}
      formSchema={formSchema}
      onAdd={(data) => DashboardManager.addCourseOffering(data)}
      onUpdate={(data) => DashboardManager.updateCourseOffering(data)}
      tableTitle="Course Offerings"
      onDelete={(id) => DashboardManager.deleteCourseOffering(id)}
    />
  );
}
