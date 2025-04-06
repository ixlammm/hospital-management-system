import { useI18n } from "@/lib/i18n";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useDatabase } from "@/lib/database";
import useNamedState from "@/hooks/use-namedstate";

export default function SelectDoctor<T extends { doctorId: string }>(props: {
    state: ReturnType<typeof useNamedState<T>>,
}) {
    const database = useDatabase()
    const { t } = useI18n()

    return <div className="flex-1 flex flex-col gap-4">
        <Label htmlFor="doctorId">{t("common.selectDoctor")}</Label>
        <Select
            defaultValue={t("common.selectDoctor")}
            value={props.state.value.doctorId}
            onValueChange={(value) => {
                props.state.update((prev) => ({
                    ...prev,
                    doctorId: value,
                }))
            }}
        >
            <SelectTrigger className="w-full" id="doctorId">
                <SelectValue placeholder={t("common.selectDoctor")} />
            </SelectTrigger>
            <SelectContent>
                {database.staff.data.map((staff: any) => (
                    <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
}