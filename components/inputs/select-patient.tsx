import { useI18n } from "@/lib/i18n";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useDatabase } from "@/lib/database";
import useNamedState from "@/hooks/use-namedstate";

export default function SelectPatient<T extends { patientId: string }>(props: {
    state: ReturnType<typeof useNamedState<T>>,
}) {
    const database = useDatabase()
    const { t } = useI18n()

    return <div className="flex-1 flex flex-col gap-4">
        <Label htmlFor="patientId">{t("common.selectPatient")}</Label>
        <Select
            defaultValue={t("common.selectPatient")}
            value={props.state.value.patientId}
            onValueChange={(value) => {
                props.state.update((prev) => ({
                    ...prev,
                    patientId: value,
                }))
            }}
        >
            <SelectTrigger className="w-full" id="patientId">
                <SelectValue placeholder={t("common.selectPatient")} />
            </SelectTrigger>
            <SelectContent>
                {database.patients.data.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
}