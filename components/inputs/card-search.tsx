import { Search } from "lucide-react";
import { CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";

export default function CardSearchHeader({ searchState }: { searchState: [string, (value: string) => void] }) {
    const { t } = useI18n()

    return (
        <CardHeader className="p-4 border-b border-[#E5E7EB] gap-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder={t("common.search")}
                        className="w-full pl-10 border-gray-200 bg-[#F9FAFB]"
                        value={searchState[0]}
                        onChange={(e) => searchState[1](e.target.value)}
                    />
                </div>
            </div>
        </CardHeader>
    )
}