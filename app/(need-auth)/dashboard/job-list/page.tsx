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
import { useEffect, useState } from "react";
import TableDataJobList from "@/components/TableDataJobList";

export default function JobListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");

  const [month, setMonth] = useState<number | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["job-list"],
    queryFn: () => getAllJobList(currentPage, search, month, year),
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  useEffect(() => {
    if (search !== "") {
      refetch();
    }
  }, [search]);
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="text-2xl font-bold px-5">Data Pekerjaan</h1>
          <div className="flex flex-col gap-3 mt-5 px-5 md:flex-row md:gap-3">
            <Input
              type="search"
              placeholder="Search..."
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              className="w-full md:w-auto"
            />

            <Button
              onClick={() => {
                setSearch(tempSearch);
              }}
              className="w-full md:w-auto"
            >
              <FiSearch size={20} />
            </Button>

            <Select
              value={month?.toString()}
              onValueChange={(value) => setMonth(Number(value))}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bulan</SelectLabel>
                  <SelectItem value="1">Januari</SelectItem>
                  <SelectItem value="2">Februari</SelectItem>
                  <SelectItem value="3">Maret</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">Mei</SelectItem>
                  <SelectItem value="6">Juni</SelectItem>
                  <SelectItem value="7">Juli</SelectItem>
                  <SelectItem value="8">Agustus</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">Desember</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={year?.toString()}
              onValueChange={(value) => setYear(Number(value))}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tahun</SelectLabel>
                  {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setCurrentPage(1);
                setSearch("");
              }}
              className="w-full md:w-auto"
            >
              Apply Filter
            </Button>
          </div>

          <TableDataJobList />
        </div>
      </div>
    </div>
  );
}
