"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllJobList } from "@/services/api/job-list";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TableDataJobList from "@/components/TableDataJobList";

export default function JobListPage() {
  const [filterDraft, setFilterDraft] = useState({
    search: "",
    status: "",
    month: "",
    year: "",
  });

  const [filter, setFilter] = useState({
    search: "",
    status: "",
    month: "",
    year: "",
  });

  function cleanFilter(obj: Record<string, string>) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v && v !== ""),
    );
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["job-list", filter],
    queryFn: ({ queryKey }) =>
      getAllJobList(cleanFilter(queryKey[1] as Record<string, string>)),
  });

  const handleInputChange =
    (field: keyof typeof filterDraft) => (val: string) => {
      setFilterDraft((prev) => ({ ...prev, [field]: val }));
    };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDraft((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleApplyFilter = () => {
    setFilter({ ...filterDraft });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="text-2xl font-bold px-5">Data Pekerjaan</h1>
          <div className="flex gap-3 px-5">
            <Input
              type="search"
              value={filterDraft.search}
              onChange={handleSearchInput}
              placeholder="Search..."
            />
            <Button onClick={handleApplyFilter}>
              <FiSearch size={20} />
            </Button>
            <Select
              value={filterDraft.month}
              onValueChange={handleInputChange("month")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Pilih Bulan</SelectLabel>
                  <SelectItem value="01">Januari</SelectItem>
                  <SelectItem value="02">Februari</SelectItem>
                  <SelectItem value="03">Maret</SelectItem>
                  <SelectItem value="04">April</SelectItem>
                  <SelectItem value="05">Mei</SelectItem>
                  <SelectItem value="06">Juni</SelectItem>
                  <SelectItem value="07">Juli</SelectItem>
                  <SelectItem value="08">Agustus</SelectItem>
                  <SelectItem value="09">September</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">Desember</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={filterDraft.year}
              onValueChange={handleInputChange("year")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Pilih Tahun</SelectLabel>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                  <SelectItem value="2028">2028</SelectItem>
                  <SelectItem value="2029">2029</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={handleApplyFilter}>Apply Filter</Button>
            <Button variant="outline">Export Excel</Button>
            <Button>+ Tambah Pekerjaan</Button>
          </div>
          <TableDataJobList />
        </div>
      </div>
    </div>
  );
}
